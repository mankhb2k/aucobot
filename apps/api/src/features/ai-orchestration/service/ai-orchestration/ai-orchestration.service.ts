import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  DEFAULT_TOGETHER_MODEL,
  generateChatWithTogether,
} from "@aucobot/llm-services";

import type { LlmCompletionPort } from "../../../../core/plugins/llm-completion.port";

@Injectable()
export class AiOrchestrationService implements LlmCompletionPort {
  constructor(private readonly configService: ConfigService) {}

  async complete(input: {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  }): Promise<string> {
    const apiKey = this.configService.get<string>("togetherApiKey");

    if (!apiKey) {
      throw new ServiceUnavailableException("TOGETHER_API_KEY is not configured");
    }

    const model =
      this.configService.get<string>("togetherModel") ?? DEFAULT_TOGETHER_MODEL;

    try {
      return await generateChatWithTogether({
        apiKey,
        system: input.system,
        messages: input.messages,
        model,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "LLM request failed",
      );
    }
  }
}
