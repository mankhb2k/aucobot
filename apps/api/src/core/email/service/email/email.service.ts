import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { LoggingService } from "../../../logging/logging.service";
import { buildOtpEmail } from "../../templates/otp-email.template";

import type { EmailOtpPurpose } from "@aucobot/shared";

interface ResendEmailResponse {
  id?: string;
  message?: string;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {}

  async sendOtpEmail(params: {
    to: string;
    code: string;
    purpose: EmailOtpPurpose;
  }): Promise<void> {
    const expiresMinutes = this.configService.getOrThrow<number>(
      "emailOtpExpiresMinutes",
    );
    const content = buildOtpEmail({
      code: params.code,
      purpose: params.purpose,
      expiresMinutes,
    });

    const apiKey = this.configService.get<string>("resendApiKey");

    if (!apiKey) {
      this.loggingService.warn(
        `RESEND_API_KEY missing — OTP for ${params.to} (${params.purpose}): ${params.code}`,
        "EmailService",
      );
      return;
    }

    await this.sendResendEmail({
      to: params.to,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
  }

  private async sendResendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const apiKey = this.configService.getOrThrow<string>("resendApiKey");
    const from = this.configService.getOrThrow<string>("emailFrom");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const body = (await response
        .json()
        .catch(() => null)) as ResendEmailResponse | null;
      const detail = body?.message ?? response.statusText;
      this.loggingService.error(
        `Failed to send email to ${params.to}: ${detail}`,
        undefined,
        "EmailService",
      );
      throw new Error(`Failed to send email: ${detail}`);
    }
  }
}
