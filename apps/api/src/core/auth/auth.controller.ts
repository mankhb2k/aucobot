import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiCookieAuth,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { WEB_DEFAULT_PORT } from "@aucobot/shared";

import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { getClientIp } from "../common/utils/get-client-ip.util";

import {
  ACCESS_TOKEN_COOKIE,
  buildDevLoginCookieInfo,
  clearAuthCookies,
  readCookieValue,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
  type AuthCookieMaxAge,
} from "./auth-cookie.util";
import { ResendEmailCodeDto } from "./dto/resend-email-code.dto";
import { SendEmailCodeDto } from "./dto/send-email-code.dto";
import { VerifyEmailCodeDto } from "./dto/verify-email-code.dto";
import { AuthService, type AuthUser } from "./service/auth/auth.service";

import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import type { DevLoginResponse } from "@aucobot/shared";
import type { Request, Response } from "express";

const DEV_LOGIN_COOKIE_USAGE_NOTE =
  "Giá trị cookies bên dưới chỉ dùng khi client (vd. Postman) chưa tự lưu Set-Cookie từ response header.";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // --- Email OTP (login / register) ---

  @Public()
  @Post("email/send-code")
  @ApiOperation({ summary: "Send 6-digit OTP for login or register" })
  @ApiOkResponse({ description: "Generic ok — does not create a user" })
  sendEmailCode(@Body() dto: SendEmailCodeDto, @Req() req: Request) {
    return this.authService.sendEmailCode(dto.email, dto.purpose, getClientIp(req));
  }

  @Public()
  @Post("email/verify-code")
  @ApiOperation({ summary: "Verify OTP and sign in or register" })
  @ApiOkResponse({ description: "Access + refresh cookies set on success" })
  async verifyEmailCode(
    @Body() dto: VerifyEmailCodeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.verifyEmailCode(
      dto.email,
      dto.code,
      dto.purpose,
      getClientIp(req),
    );
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    return { ok: true, user: tokens.user, accessExpiresAt: tokens.accessExpiresAt };
  }

  @Public()
  @Post("email/resend-code")
  @ApiOperation({ summary: "Resend OTP after cooldown" })
  @ApiOkResponse({ description: "Generic ok" })
  resendEmailCode(@Body() dto: ResendEmailCodeDto, @Req() req: Request) {
    return this.authService.resendEmailCode(dto.email, dto.purpose, getClientIp(req));
  }

  // --- Session ---

  @Public()
  @Post("logout")
  @ApiOperation({ summary: "Revoke refresh token and clear cookies" })
  @ApiOkResponse({ description: "Cookies cleared" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeRefreshToken(this.readRefreshToken(req));
    clearAuthCookies(res);

    return { ok: true };
  }

  @Public()
  @Post("refresh")
  @ApiOperation({ summary: "Rotate refresh token and issue new access token" })
  @ApiOkResponse({ description: "New access + refresh cookies set" })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.readRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    const tokens = await this.authService.refreshSession(refreshToken);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    return { ok: true, user: tokens.user, accessExpiresAt: tokens.accessExpiresAt };
  }

  @Public()
  @Get("session")
  @ApiOperation({
    summary: "Access token expiry from cookie (for proactive client refresh)",
  })
  @ApiOkResponse({ description: "accessExpiresAt ISO string or null" })
  getSession(@Req() req: Request) {
    const accessToken = readCookieValue(req.cookies, ACCESS_TOKEN_COOKIE);

    return {
      accessExpiresAt: this.authService.decodeAccessExpiresAt(accessToken),
    };
  }

  @Get("me")
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Current authenticated user" })
  @ApiOkResponse({ description: "User profile from JWT" })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.userId);
  }

  @Public()
  @Post("dev-login")
  @ApiOperation({
    summary: "Development only — sign in as DEV_AUTH_EMAIL without OTP/OAuth",
  })
  @ApiOkResponse({
    description:
      "Sets auth cookies; JSON includes cookie values for manual Postman setup",
  })
  async devLogin(@Res({ passthrough: true }) res: Response): Promise<DevLoginResponse> {
    if (this.configService.get<string>("nodeEnv") !== "development") {
      throw new NotFoundException();
    }

    const tokens = await this.authService.devLogin();
    const cookieMaxAge = this.getCookieMaxAge();
    setAuthCookies(res, tokens, cookieMaxAge);

    return {
      ok: true,
      user: tokens.user,
      accessExpiresAt: tokens.accessExpiresAt,
      cookies: buildDevLoginCookieInfo(tokens, cookieMaxAge),
      cookieUsageNote: DEV_LOGIN_COOKIE_USAGE_NOTE,
    };
  }

  // --- Google OAuth ---

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Redirect to Google OAuth consent" })
  @ApiFoundResponse({ description: "302 redirect to Google" })
  googleAuth() {
    // Passport redirects to Google.
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  @ApiFoundResponse({ description: "Sets auth cookies and redirects to WEB_ORIGIN/" })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthUser | undefined;

    if (!user) {
      throw new UnauthorizedException("Google sign-in failed");
    }

    const tokens = await this.authService.issueTokenPair(user);
    setAuthCookies(res, tokens, this.getCookieMaxAge());

    const webOrigin = this.configService
      .get<string>("webOrigin", `http://localhost:${WEB_DEFAULT_PORT}`)
      .replace(/\/$/, "");
    res.redirect(`${webOrigin}/`);
  }

  private getCookieMaxAge(): AuthCookieMaxAge {
    return {
      accessMaxAgeMs: this.configService.getOrThrow<number>("authAccessCookieMaxAgeMs"),
      refreshMaxAgeMs: this.configService.getOrThrow<number>(
        "authRefreshCookieMaxAgeMs",
      ),
    };
  }

  private readRefreshToken(req: Request): string | undefined {
    return readCookieValue(req.cookies, REFRESH_TOKEN_COOKIE);
  }
}
