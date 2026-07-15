import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  DEFAULT_TOGETHER_MODEL,
  generateChatWithTogether,
  streamAgentWithTogether,
  streamChatWithTogether,
} from "@aucobot/llm-services";

import { PluginRegistry } from "../../../../core/plugins/plugin.registry";

import type { LlmCompletionPort } from "../../../../core/plugins/llm-completion.port";
import type { ToolSet } from "ai" with { "resolution-mode": "import" };

@Injectable()
export class AiOrchestrationService implements LlmCompletionPort {
  constructor(
    private readonly configService: ConfigService,
    private readonly pluginRegistry: PluginRegistry,
  ) {}

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
    skillGroups?: string[];
    toolContext?: {
      ownerId: string;
      agentId: string;
      conversationId: string;
    };
    onToolStart?: (event: {
      toolCallId: string;
      toolName: string;
      input: unknown;
    }) => void;
    onToolFinish?: (event: {
      toolCallId: string;
      toolName: string;
      output: unknown;
      ok: boolean;
      errorMessage?: string;
    }) => void;
  }): Promise<string> {
    const { apiKey, model } = this.resolveTogetherConfig();

    const tools: ToolSet | undefined =
      input.skillGroups && input.skillGroups.length > 0 && input.toolContext
        ? this.pluginRegistry.getToolsForSkillGroups(
            input.skillGroups,
            input.toolContext,
          )
        : undefined;

    try {
      if (tools && Object.keys(tools).length > 0) {
        return await streamAgentWithTogether({
          apiKey,
          system: input.system,
          messages: input.messages,
          model,
          tools,
          maxSteps: 5,
          onChunk: input.onChunk,
          onToolStart: input.onToolStart,
          onToolFinish: input.onToolFinish,
        });
      }

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

  toolLabel(name: string): string {
    return this.pluginRegistry.getLabel(name);
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
