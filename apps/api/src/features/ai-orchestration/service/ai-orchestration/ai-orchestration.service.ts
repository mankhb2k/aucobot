import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  DEFAULT_TOGETHER_MODEL,
  generateChatWithTogether,
  streamChatWithTogether,
} from "@aucobot/llm-services";

import type { LlmCompletionPort } from "../../../../core/plugins/llm-completion.port";

@Injectable()
export class AiOrchestrationService implements LlmCompletionPort {
  constructor(private readonly configService: ConfigService) {}

  async complete(input: {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  }): Promise<string> {
    const { apiKey, model } = this.resolveTogetherConfig();

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

  async stream(input: {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    onChunk: (delta: string) => void;
  }): Promise<string> {
    const { apiKey, model } = this.resolveTogetherConfig();

    try {
      return await streamChatWithTogether({
        apiKey,
        system: input.system,
        messages: input.messages,
        model,
        onChunk: input.onChunk,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "LLM stream failed",
      );
    }
  }

  private resolveTogetherConfig(): { apiKey: string; model: string } {
    const apiKey = this.configService.get<string>("togetherApiKey");

    if (!apiKey) {
      throw new ServiceUnavailableException("TOGETHER_API_KEY is not configured");
    }

    return {
      apiKey,
      model: this.configService.get<string>("togetherModel") ?? DEFAULT_TOGETHER_MODEL,
    };
  }
}
