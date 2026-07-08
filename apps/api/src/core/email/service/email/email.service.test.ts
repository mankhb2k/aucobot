import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { LoggingService } from "../../../logging/logging.service";

import { EmailService } from "./email.service";

describe("EmailService", () => {
  let service: EmailService;
  let fetchSpy: jest.SpiedFunction<typeof fetch>;

  const configService = {
    get: jest.fn(),
    getOrThrow: jest.fn((key: string) => {
      const values: Record<string, unknown> = {
        emailOtpExpiresMinutes: 10,
        resendApiKey: "re_test_key",
        emailFrom: "Aucobot <test@example.com>",
      };

      return values[key];
    }),
  };

  const loggingService = {
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    fetchSpy = jest.spyOn(global, "fetch");

    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: configService },
        { provide: LoggingService, useValue: loggingService },
      ],
    }).compile();

    service = module.get(EmailService);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("logs and skips Resend when RESEND_API_KEY is missing", async () => {
    configService.get.mockReturnValue(undefined);

    await service.sendOtpEmail({
      to: "dev@aucobot.local",
      code: "123456",
      purpose: "login",
    });

    expect(loggingService.warn).toHaveBeenCalledWith(
      "RESEND_API_KEY missing — OTP for dev@aucobot.local (login): 123456",
      "EmailService",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends OTP email via Resend when API key is configured", async () => {
    configService.get.mockReturnValue("re_test_key");
    fetchSpy.mockResolvedValue(new Response(null, { status: 200 }));

    await service.sendOtpEmail({
      to: "dev@aucobot.local",
      code: "654321",
      purpose: "register",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test_key",
        }) as Record<string, string>,
      }),
    );
  });

  it("throws and logs when Resend returns an error", async () => {
    configService.get.mockReturnValue("re_test_key");
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid from address" }), {
        status: 400,
        statusText: "Bad Request",
      }),
    );

    await expect(
      service.sendOtpEmail({
        to: "dev@aucobot.local",
        code: "111111",
        purpose: "login",
      }),
    ).rejects.toThrow("Failed to send email: Invalid from address");

    expect(loggingService.error).toHaveBeenCalledWith(
      "Failed to send email to dev@aucobot.local: Invalid from address",
      undefined,
      "EmailService",
    );
  });
});
