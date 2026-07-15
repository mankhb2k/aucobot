import { randomUUID } from "crypto";

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Optional,
  ServiceUnavailableException,
} from "@nestjs/common";

import {
  createWsEvent,
  TOOL_UI_LABELS,
  type KnowledgeToolName,
  CreateMessageInput,
  MessageListResponse,
  MessageResponse,
  SendMessageResponse,
} from "@aucobot/shared";

import { AgentResolverService } from "../../../agents/service/agent-resolver/agent-resolver.service";
import { PrismaService } from "../../../database/prisma.service";
import { FeatureFlagsService } from "../../../features/service/feature-flags/feature-flags.service";
import { LLM_COMPLETION_PORT } from "../../../plugins/llm-completion.port";
import { CONVERSATION_EVENTS_PORT } from "../../../realtime/conversation-events.port";
import { ConversationAccessService } from "../conversation-access/conversation-access.service";

import type { LlmCompletionPort } from "../../../plugins/llm-completion.port";
import type { ConversationEventsPort } from "../../../realtime/conversation-events.port";
import type { Message, Prisma } from "@aucobot/database";

const MESSAGE_HISTORY_LIMIT = 20;

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ConversationAccessService,
    private readonly agentResolver: AgentResolverService,
    private readonly featureFlags: FeatureFlagsService,
    @Optional()
    @Inject(LLM_COMPLETION_PORT)
    private readonly llmCompletion: LlmCompletionPort | null,
    @Optional()
    @Inject(CONVERSATION_EVENTS_PORT)
    private readonly conversationEvents: ConversationEventsPort | null,
  ) {}

  async listForConversation(
    userId: string,
    conversationId: string,
  ): Promise<MessageListResponse> {
    await this.access.assert(userId, conversationId);

    const rows = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return { items: rows.map((row) => this.toResponse(row)) };
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    input: CreateMessageInput,
  ): Promise<SendMessageResponse> {
    const conversation = await this.access.assert(userId, conversationId);

    if (conversation.type !== "session") {
      throw new BadRequestException(
        "Messages are only supported for sessions in Phase A",
      );
    }

    this.featureFlags.assertEnabled("ai-orchestration");

    if (!this.llmCompletion) {
      throw new ServiceUnavailableException("AI orchestration is not configured");
    }

    const agent = await this.agentResolver.resolveForSession(conversationId);
    const content = input.content.trim();

    const userMessage = await this.prisma.message.create({
      data: {
        conversationId,
        ownerId: userId,
        senderType: "user",
        content,
      },
    });

    const history = await this.loadChatHistory(conversationId);
    const shouldStream =
      Boolean(this.conversationEvents?.hasClients(conversationId)) &&
      typeof this.llmCompletion.stream === "function";

    if (shouldStream) {
      void this.runAssistantStream({
        userId,
        conversationId,
        agentId: agent.id,
        system: agent.instructionsCompiled,
        skillGroups: agent.enabledSkillGroups ?? [],
        history,
      }).catch((error: unknown) => {
        this.logger.error(
          `Stream failed for ${conversationId}: ${
            error instanceof Error ? error.message : "unknown"
          }`,
        );
      });

      return {
        userMessage: this.toResponse(userMessage),
        streaming: true,
      };
    }

    const reply = await this.llmCompletion.complete({
      system: agent.instructionsCompiled,
      messages: history,
    });

    const assistantMessage = await this.persistAssistantMessage({
      conversationId,
      userId,
      agentId: agent.id,
      content: reply,
    });

    return {
      userMessage: this.toResponse(userMessage),
      assistantMessage: this.toResponse(assistantMessage),
      streaming: false,
    };
  }

  private async runAssistantStream(input: {
    userId: string;
    conversationId: string;
    agentId: string;
    system: string;
    skillGroups: string[];
    history: Array<{ role: "user" | "assistant"; content: string }>;
  }): Promise<void> {
    if (!this.llmCompletion?.stream || !this.conversationEvents) {
      return;
    }

    const streamingId = randomUUID();
    const runId = streamingId;
    const summarizeInput = (value: unknown): string | undefined => {
      if (value == null) return undefined;
      if (typeof value === "string") return value.slice(0, 160);
      try {
        return JSON.stringify(value).slice(0, 160);
      } catch {
        return undefined;
      }
    };

    const reply = await this.llmCompletion.stream({
      system: input.system,
      messages: input.history,
      skillGroups: input.skillGroups,
      toolContext: {
        ownerId: input.userId,
        agentId: input.agentId,
        conversationId: input.conversationId,
      },
      onChunk: (delta) => {
        this.conversationEvents?.emit(
          input.conversationId,
          createWsEvent("message.chunk", input.conversationId, {
            messageId: streamingId,
            delta,
          }),
        );
      },
      onToolStart: (event) => {
        const label =
          this.llmCompletion?.toolLabel?.(event.toolName) ??
          TOOL_UI_LABELS[event.toolName as KnowledgeToolName] ??
          event.toolName;
        this.conversationEvents?.emit(
          input.conversationId,
          createWsEvent("tool.started", input.conversationId, {
            runId,
            toolCallId: event.toolCallId,
            name: event.toolName,
            label,
            inputSummary: summarizeInput(event.input),
          }),
        );
      },
      onToolFinish: (event) => {
        if (!event.ok) {
          this.conversationEvents?.emit(
            input.conversationId,
            createWsEvent("tool.error", input.conversationId, {
              runId,
              toolCallId: event.toolCallId,
              name: event.toolName,
              message: event.errorMessage ?? "Tool failed",
            }),
          );
          return;
        }

        const detail =
          typeof event.output === "object" &&
          event.output &&
          "preview" in event.output &&
          typeof (event.output as { preview?: unknown }).preview === "string"
            ? (event.output as { preview: string }).preview
            : typeof event.output === "object" &&
                event.output &&
                "title" in event.output &&
                typeof (event.output as { title?: unknown }).title === "string"
              ? (event.output as { title: string }).title
              : typeof event.output === "object" &&
                  event.output &&
                  "query" in event.output &&
                  typeof (event.output as { query?: unknown }).query === "string"
                ? (event.output as { query: string }).query
                : undefined;

        this.conversationEvents?.emit(
          input.conversationId,
          createWsEvent("tool.finished", input.conversationId, {
            runId,
            toolCallId: event.toolCallId,
            name: event.toolName,
            ok: true,
            detail,
          }),
        );
      },
    });

    const assistantMessage = await this.persistAssistantMessage({
      conversationId: input.conversationId,
      userId: input.userId,
      agentId: input.agentId,
      content: reply,
    });

    this.conversationEvents.emit(
      input.conversationId,
      createWsEvent("message.done", input.conversationId, {
        messageId: assistantMessage.id,
        streamingId,
        content: reply,
      }),
    );
  }

  private async persistAssistantMessage(input: {
    conversationId: string;
    userId: string;
    agentId: string;
    content: string;
  }): Promise<Message> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.message.create({
        data: {
          conversationId: input.conversationId,
          ownerId: input.userId,
          senderType: "agent",
          agentId: input.agentId,
          content: input.content,
        },
      });

      await tx.conversation.update({
        where: { id: input.conversationId },
        data: { lastMessageAt: created.createdAt },
      });

      return created;
    });
  }

  private async loadChatHistory(
    conversationId: string,
  ): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
    const rows = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: MESSAGE_HISTORY_LIMIT,
    });

    return rows.reverse().map((row: Message) => ({
      role: row.senderType === "user" ? ("user" as const) : ("assistant" as const),
      content: row.content,
    }));
  }

  private toResponse(row: Message): MessageResponse {
    return {
      id: row.id,
      conversationId: row.conversationId,
      senderType: row.senderType,
      agentId: row.agentId,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
