import {
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { generateChatWithTogether } from "@aucobot/llm-services";

import { AiOrchestrationService } from "./ai-orchestration.service";

jest.mock("@aucobot/llm-services", () => ({
  DEFAULT_TOGETHER_MODEL: "Qwen/Qwen2.5-7B-Instruct-Turbo",
  generateChatWithTogether: jest.fn(),
}));

describe("AiOrchestrationService", () => {
  let service: AiOrchestrationService;

  const generateChatWithTogetherMock = generateChatWithTogether as jest.MockedFunction<
    typeof generateChatWithTogether
  >;

  const configService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AiOrchestrationService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(AiOrchestrationService);
    jest.clearAllMocks();
  });

  it("throws when API key is missing", async () => {
    configService.get.mockReturnValue(undefined);

    await expect(
      service.complete({ system: "sys", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("delegates to generateChatWithTogether", async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === "togetherApiKey") return "test-key";
      if (key === "togetherModel") return undefined;
      return undefined;
    });
    generateChatWithTogetherMock.mockResolvedValue("Hello!");

    const result = await service.complete({
      system: "You are helpful",
      messages: [{ role: "user", content: "hi" }],
    });

    expect(result).toBe("Hello!");
    expect(generateChatWithTogetherMock).toHaveBeenCalledWith({
      apiKey: "test-key",
      system: "You are helpful",
      messages: [{ role: "user", content: "hi" }],
      model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
    });
  });

  it("wraps provider errors", async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === "togetherApiKey") return "test-key";
      return undefined;
    });
    generateChatWithTogetherMock.mockRejectedValue(new Error("provider down"));

    await expect(
      service.complete({ system: "sys", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
