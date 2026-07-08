import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "../../../database/prisma.service";
import { EmailService } from "../../../email/service/email/email.service";
import { OtpRateLimitService } from "../otp-rate-limit/otp-rate-limit.service";

import type { User } from "@aucobot/database";
import type {
  EmailOtpPurpose,
  SendEmailCodeResponse,
  UserResponse,
} from "@aucobot/shared";

export type AuthUser = User;

export interface GoogleProfileInput {
  googleId: string;

  email: string;

  name?: string | null;

  avatarUrl?: string | null;
}

export interface TokenPair {
  accessToken: string;

  refreshToken: string;

  accessExpiresAt: string;

  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,

    private readonly emailService: EmailService,

    private readonly otpRateLimitService: OtpRateLimitService,
  ) {}

  async sendEmailCode(
    email: string,

    purpose: EmailOtpPurpose,

    clientIp: string,
  ): Promise<SendEmailCodeResponse> {
    const normalizedEmail = this.normalizeEmail(email);

    if (await this.otpRateLimitService.isInResendCooldown(normalizedEmail, purpose)) {
      return {
        ok: true,

        expiresInSeconds: this.getOtpExpiresInSeconds(),
      };
    }

    await this.otpRateLimitService.assertIpSendAllowed(clientIp);

    await this.prisma.emailOtpChallenge.deleteMany({
      where: { email: normalizedEmail, purpose },
    });

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");

    const codeHash = this.hashOtpCode(code);

    const expiresAt = this.getOtpExpiresAt();

    await this.prisma.emailOtpChallenge.create({
      data: {
        email: normalizedEmail,

        purpose,

        codeHash,

        expiresAt,
      },
    });

    await this.emailService.sendOtpEmail({
      to: normalizedEmail,

      code,

      purpose,
    });

    await this.otpRateLimitService.markResendSent(normalizedEmail, purpose);

    return {
      ok: true,

      expiresInSeconds: this.getOtpExpiresInSeconds(),
    };
  }

  async resendEmailCode(
    email: string,

    purpose: EmailOtpPurpose,

    clientIp: string,
  ): Promise<SendEmailCodeResponse> {
    return this.sendEmailCode(email, purpose, clientIp);
  }

  async verifyEmailCode(
    email: string,

    code: string,

    purpose: EmailOtpPurpose,

    clientIp: string,
  ): Promise<TokenPair> {
    await this.otpRateLimitService.assertIpVerifyAllowed(clientIp);

    const normalizedEmail = this.normalizeEmail(email);

    const challenge = await this.prisma.emailOtpChallenge.findFirst({
      where: {
        email: normalizedEmail,

        purpose,

        usedAt: null,

        expiresAt: { gt: new Date() },
      },

      orderBy: { createdAt: "desc" },
    });

    const maxAttempts = this.configService.getOrThrow<number>("emailOtpMaxAttempts");

    if (!challenge || challenge.attempts >= maxAttempts) {
      throw new UnauthorizedException("Invalid or expired verification code");
    }

    const codeHash = this.hashOtpCode(code);

    if (codeHash !== challenge.codeHash) {
      const nextAttempts = challenge.attempts + 1;

      const locked = nextAttempts >= maxAttempts;

      await this.prisma.emailOtpChallenge.update({
        where: { id: challenge.id },

        data: {
          attempts: nextAttempts,

          ...(locked ? { usedAt: new Date() } : {}),
        },
      });

      throw new UnauthorizedException("Invalid or expired verification code");
    }

    let user: User;

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      user = existing.emailVerifiedAt
        ? existing
        : await this.prisma.user.update({
            where: { id: existing.id },

            data: { emailVerifiedAt: new Date() },
          });
    } else {
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,

          emailVerifiedAt: new Date(),
        },
      });
    }

    await this.prisma.emailOtpChallenge.update({
      where: { id: challenge.id },

      data: { usedAt: new Date() },
    });

    return this.issueTokenPair(user);
  }

  async validateGoogleProfile(profile: GoogleProfileInput): Promise<User> {
    const now = new Date();

    const byGoogleId = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (byGoogleId) {
      return this.prisma.user.update({
        where: { id: byGoogleId.id },

        data: {
          avatarUrl: profile.avatarUrl ?? byGoogleId.avatarUrl,

          name: byGoogleId.name ?? profile.name ?? null,

          emailVerifiedAt: byGoogleId.emailVerifiedAt ?? now,
        },
      });
    }

    const byEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (byEmail) {
      return this.prisma.user.update({
        where: { id: byEmail.id },

        data: {
          googleId: profile.googleId,

          avatarUrl: profile.avatarUrl ?? byEmail.avatarUrl,

          name: byEmail.name ?? profile.name ?? null,

          emailVerifiedAt: byEmail.emailVerifiedAt ?? now,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,

        googleId: profile.googleId,

        avatarUrl: profile.avatarUrl ?? null,

        name: profile.name ?? null,

        emailVerifiedAt: now,
      },
    });
  }

  async devLogin(): Promise<TokenPair> {
    const email = this.configService.getOrThrow<string>("devAuthEmail");
    const user = await this.findOrCreateDevUser(email);

    return this.issueTokenPair(user);
  }

  async issueTokenPair(user: User): Promise<TokenPair> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,

      email: user.email,
    });

    const refreshToken = await this.createRefreshToken(user.id);

    const accessExpiresAt = this.resolveAccessExpiresAt(accessToken);

    return {
      accessToken,

      refreshToken,

      accessExpiresAt,

      user: this.toUserResponse(user),
    };
  }

  decodeAccessExpiresAt(accessToken: string | undefined): string | null {
    if (!accessToken) {
      return null;
    }

    const decoded: unknown = this.jwtService.decode(accessToken);

    if (!this.isJwtExpPayload(decoded)) {
      return null;
    }

    return new Date(decoded.exp * 1000).toISOString();
  }

  async refreshSession(refreshTokenPlain: string): Promise<TokenPair> {
    const tokenHash = this.hashRefreshToken(refreshTokenPlain);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },

      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!stored.user.emailVerifiedAt) {
      throw new ForbiddenException("Email not verified");
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },

      data: { revokedAt: new Date() },
    });

    return this.issueTokenPair(stored.user);
  }

  async revokeRefreshToken(refreshTokenPlain: string | undefined): Promise<void> {
    if (!refreshTokenPlain) {
      return;
    }

    const tokenHash = this.hashRefreshToken(refreshTokenPlain);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },

      data: { revokedAt: new Date() },
    });
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toUserResponse(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async findOrCreateDevUser(email: string): Promise<User> {
    const normalizedEmail = this.normalizeEmail(email);
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.emailVerifiedAt) {
        return existing;
      }

      return this.prisma.user.update({
        where: { id: existing.id },
        data: { emailVerifiedAt: new Date() },
      });
    }

    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: "Dev User",
        emailVerifiedAt: new Date(),
      },
    });
  }

  private getOtpExpiresInSeconds(): number {
    const minutes = this.configService.getOrThrow<number>("emailOtpExpiresMinutes");

    return minutes * 60;
  }

  private getOtpExpiresAt(): Date {
    return new Date(Date.now() + this.getOtpExpiresInSeconds() * 1000);
  }

  private isJwtExpPayload(value: unknown): value is { exp: number } {
    if (typeof value !== "object" || value === null || !("exp" in value)) {
      return false;
    }

    return typeof Reflect.get(value, "exp") === "number";
  }

  private resolveAccessExpiresAt(accessToken: string): string {
    const decoded = this.decodeAccessExpiresAt(accessToken);

    if (decoded) {
      return decoded;
    }

    const ms = this.configService.getOrThrow<number>("authAccessCookieMaxAgeMs");

    return new Date(Date.now() + ms).toISOString();
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const plain = randomBytes(32).toString("base64url");

    const tokenHash = this.hashRefreshToken(plain);

    const expiresAt = this.getRefreshExpiresAt();

    await this.prisma.refreshToken.create({
      data: {
        userId,

        tokenHash,

        expiresAt,
      },
    });

    return plain;
  }

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private hashOtpCode(code: string): string {
    const secret = this.configService.getOrThrow<string>("emailOtpHmacSecret");

    return createHmac("sha256", secret).update(code).digest("hex");
  }

  private getRefreshExpiresAt(): Date {
    const days = this.configService.getOrThrow<number>("refreshTokenExpiresInDays");

    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,

      email: user.email,

      name: user.name,

      avatarUrl: user.avatarUrl,

      timezone: user.timezone,

      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,

      createdAt: user.createdAt.toISOString(),
    };
  }
}
