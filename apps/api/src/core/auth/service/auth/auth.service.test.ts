import { createHmac } from "node:crypto";

import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";
import { EmailService } from "../../../email/service/email/email.service";
import { OtpRateLimitService } from "../otp-rate-limit/otp-rate-limit.service";

import { AuthService } from "./auth.service";

import type { User } from "@aucobot/database";

const OTP_HMAC_SECRET = "test-hmac-secret-min-16";

const mockUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "demo@aucobot.vn",
  googleId: null,
  avatarUrl: null,
  name: "Demo",
  timezone: "Asia/Ho_Chi_Minh",
  emailVerifiedAt: new Date("2025-06-28T00:00:00.000Z"),
  createdAt: new Date("2025-06-28T00:00:00.000Z"),
  updatedAt: new Date("2025-06-28T00:00:00.000Z"),
  ...overrides,
});

const hashOtpCode = (code: string): string =>
  createHmac("sha256", OTP_HMAC_SECRET).update(code).digest("hex");

describe("AuthService", () => {
  let authService: AuthService;

  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    emailOtpChallenge: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue("jwt-token"),
    decode: jest.fn().mockReturnValue({ exp: 1_900_000_000 }),
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      if (key === "refreshTokenExpiresInDays") {
        return 30;
      }

      return defaultValue;
    }),
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, unknown> = {
        authAccessCookieMaxAgeMs: 900_000,
        refreshTokenExpiresInDays: 30,
        emailOtpExpiresMinutes: 10,
        emailOtpResendCooldownSeconds: 60,
        emailOtpMaxAttempts: 5,
        emailOtpHmacSecret: OTP_HMAC_SECRET,
        devAuthEmail: "dev@aucobot.local",
      };

      return values[key];
    }),
  };

  const emailService = {
    sendOtpEmail: jest.fn().mockResolvedValue(undefined),
  };

  const otpRateLimitService = {
    isInResendCooldown: jest.fn().mockResolvedValue(false),
    markResendSent: jest.fn().mockResolvedValue(undefined),
    assertIpSendAllowed: jest.fn().mockResolvedValue(undefined),
    assertIpVerifyAllowed: jest.fn().mockResolvedValue(undefined),
  };

  const clientIp = "127.0.0.1";

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: emailService },
        { provide: OtpRateLimitService, useValue: otpRateLimitService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma.refreshToken.create.mockResolvedValue({ id: "rt-1" });
    prisma.emailOtpChallenge.deleteMany.mockResolvedValue({ count: 0 });
    prisma.emailOtpChallenge.create.mockResolvedValue({ id: "otp-1" });
    otpRateLimitService.isInResendCooldown.mockResolvedValue(false);
  });

  describe("email OTP", () => {
    const email = "otp@aucobot.vn";
    const code = "123456";
    const codeHash = hashOtpCode(code);

    const activeChallenge = {
      id: "otp-1",
      email,
      purpose: "register" as const,
      codeHash,
      attempts: 0,
      expiresAt: new Date(Date.now() + 600_000),
      usedAt: null,
      createdAt: new Date(),
    };

    it("sendEmailCode does not create a user", async () => {
      const result = await authService.sendEmailCode(email, "register", clientIp);

      expect(result).toEqual({ ok: true, expiresInSeconds: 600 });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.emailOtpChallenge.create).toHaveBeenCalled();
      expect(otpRateLimitService.assertIpSendAllowed).toHaveBeenCalledWith(clientIp);
      expect(otpRateLimitService.markResendSent).toHaveBeenCalledWith(
        email,
        "register",
      );
      expect(emailService.sendOtpEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: email, purpose: "register" }),
      );
    });

    it("sendEmailCode skips email during resend cooldown", async () => {
      otpRateLimitService.isInResendCooldown.mockResolvedValue(true);

      const result = await authService.sendEmailCode(email, "register", clientIp);

      expect(result).toEqual({ ok: true, expiresInSeconds: 600 });
      expect(otpRateLimitService.assertIpSendAllowed).not.toHaveBeenCalled();
      expect(emailService.sendOtpEmail).not.toHaveBeenCalled();
    });

    it("verify creates a new user when email is new", async () => {
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "register",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(
        email,
        code,
        "register",
        clientIp,
      );

      expect(otpRateLimitService.assertIpVerifyAllowed).toHaveBeenCalledWith(clientIp);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email,
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.accessToken).toBe("jwt-token");
    });

    it("verify signs in when email already exists (register route)", async () => {
      const user = mockUser({ email });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "register",
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(
        email,
        code,
        "register",
        clientIp,
      );

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.email).toBe(email);
    });

    it("verify creates user when email is new (login route)", async () => {
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      await authService.verifyEmailCode(email, code, "login", clientIp);

      expect(prisma.user.create).toHaveBeenCalled();
    });

    it("verify signs in existing verified user (login route)", async () => {
      const user = mockUser({ email });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      const result = await authService.verifyEmailCode(email, code, "login", clientIp);

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.email).toBe(email);
    });

    it("verify verifies legacy unverified user on OTP success", async () => {
      const unverified = mockUser({ email, emailVerifiedAt: null });
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        purpose: "login",
      });
      prisma.user.findUnique.mockResolvedValue(unverified);
      prisma.user.update.mockResolvedValue(mockUser({ email }));
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        usedAt: new Date(),
      });

      await authService.verifyEmailCode(email, code, "login", clientIp);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: unverified.id },
          data: { emailVerifiedAt: expect.any(Date) as Date },
        }),
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("invalidates challenge after max failed attempts", async () => {
      prisma.emailOtpChallenge.findFirst.mockResolvedValue({
        ...activeChallenge,
        attempts: 4,
      });
      prisma.emailOtpChallenge.update.mockResolvedValue({
        ...activeChallenge,
        attempts: 5,
        usedAt: new Date(),
      });

      await expect(
        authService.verifyEmailCode(email, "000000", "register", clientIp),
      ).rejects.toThrow(UnauthorizedException);

      expect(prisma.emailOtpChallenge.update).toHaveBeenCalledWith({
        where: { id: activeChallenge.id },
        data: {
          attempts: 5,
          usedAt: expect.any(Date) as Date,
        },
      });
    });
  });

  describe("validateGoogleProfile", () => {
    it("merges googleId when user exists by email", async () => {
      const existing = mockUser({ googleId: null, emailVerifiedAt: null });
      const merged = mockUser({ googleId: "google-123" });

      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(existing);
      prisma.user.update.mockResolvedValue(merged);

      const result = await authService.validateGoogleProfile({
        googleId: "google-123",
        email: existing.email,
        name: "Google Name",
      });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: existing.id },
          data: expect.objectContaining({
            googleId: "google-123",
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.googleId).toBe("google-123");
    });

    it("creates verified user when no match by googleId or email", async () => {
      const created = mockUser({ email: "new@aucobot.vn", googleId: "google-new" });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(created);

      const result = await authService.validateGoogleProfile({
        googleId: "google-new",
        email: "new@aucobot.vn",
      });

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emailVerifiedAt: expect.any(Date) as Date,
          }) as object,
        }),
      );
      expect(result.email).toBe("new@aucobot.vn");
    });
  });

  describe("refreshSession", () => {
    it("throws when refresh token is invalid", async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(authService.refreshSession("invalid-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("rotates refresh token and returns new pair", async () => {
      const user = mockUser();
      const stored = {
        id: "rt-old",
        userId: user.id,
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 86_400_000),
        revokedAt: null,
        createdAt: new Date(),
        user,
      };

      prisma.refreshToken.findUnique.mockResolvedValue(stored);
      prisma.refreshToken.update.mockResolvedValue({
        ...stored,
        revokedAt: new Date(),
      });

      const result = await authService.refreshSession("valid-plain-token");

      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: stored.id },
          data: { revokedAt: expect.any(Date) as Date },
        }),
      );
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(result.accessToken).toBe("jwt-token");
      expect(result.refreshToken).toEqual(expect.any(String));
    });
  });

  describe("revokeRefreshToken", () => {
    it("revokes active refresh token", async () => {
      await authService.revokeRefreshToken("logout-token");

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ revokedAt: null }) as object,
          data: { revokedAt: expect.any(Date) as Date },
        }),
      );
    });

    it("no-ops when token missing", async () => {
      await authService.revokeRefreshToken(undefined);

      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("decodeAccessExpiresAt", () => {
    it("returns ISO expiry from JWT exp claim", () => {
      expect(authService.decodeAccessExpiresAt("jwt-token")).toBe(
        new Date(1_900_000_000 * 1000).toISOString(),
      );
    });

    it("returns null when token missing or undecodable", () => {
      jwtService.decode.mockReturnValueOnce(null);

      expect(authService.decodeAccessExpiresAt(undefined)).toBeNull();
      expect(authService.decodeAccessExpiresAt("bad-token")).toBeNull();
    });
  });

  describe("devLogin", () => {
    it("creates a verified dev user and issues tokens", async () => {
      const created = mockUser({ email: "dev@aucobot.local", name: "Dev User" });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(created);
      prisma.refreshToken.create.mockResolvedValue({ id: "rt-1" });

      const result = await authService.devLogin();

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "dev@aucobot.local",
          name: "Dev User",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jest asymmetric matcher
          emailVerifiedAt: expect.any(Date),
        },
      });
      expect(result.user.email).toBe("dev@aucobot.local");
      expect(result.accessToken).toBe("jwt-token");
    });

    it("reuses existing dev user and verifies email if needed", async () => {
      const existing = mockUser({
        email: "dev@aucobot.local",
        emailVerifiedAt: null,
      });
      const updated = mockUser({ email: "dev@aucobot.local" });
      prisma.user.findUnique.mockResolvedValue(existing);
      prisma.user.update.mockResolvedValue(updated);
      prisma.refreshToken.create.mockResolvedValue({ id: "rt-1" });

      const result = await authService.devLogin();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: existing.id },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jest asymmetric matcher
          emailVerifiedAt: expect.any(Date),
        },
      });
      expect(result.user.email).toBe("dev@aucobot.local");
    });
  });

  describe("getMe", () => {
    it("throws NotFoundException when user missing", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getMe("missing-id")).rejects.toThrow(NotFoundException);
    });

    it("returns user response", async () => {
      const user = mockUser();
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await authService.getMe(user.id);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        timezone: user.timezone,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
      });
    });
  });
});
