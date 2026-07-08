import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  ServiceUnavailableException,
} from "@nestjs/common";

import { AgentResolverService } from "../../../agents/service/agent-resolver/agent-resolver.service";
import { PrismaService } from "../../../database/prisma.service";
import { FeatureFlagsService } from "../../../features/service/feature-flags/feature-flags.service";
import { LLM_COMPLETION_PORT } from "../../../plugins/llm-completion.port";
import { ConversationAccessService } from "../conversation-access/conversation-access.service";

import type { LlmCompletionPort } from "../../../plugins/llm-completion.port";
import type { Message, Prisma } from "@aucobot/database";
import type {
  CreateMessageInput,
  MessageListResponse,
  MessageResponse,
  SendMessageResponse,
} from "@aucobot/shared";

const MESSAGE_HISTORY_LIMIT = 20;

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ConversationAccessService,
    private readonly agentResolver: AgentResolverService,
    private readonly featureFlags: FeatureFlagsService,
    @Optional()
    @Inject(LLM_COMPLETION_PORT)
    private readonly llmCompletion: LlmCompletionPort | null,
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
    const reply = await this.llmCompletion.complete({
      system: agent.instructionsCompiled,
      messages: history,
    });

    const assistantMessage = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const created = await tx.message.create({
          data: {
            conversationId,
            ownerId: userId,
            senderType: "agent",
            agentId: agent.id,
            content: reply,
          },
        });

        await tx.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: created.createdAt },
        });

        return created;
      },
    );

    return {
      userMessage: this.toResponse(userMessage),
      assistantMessage: this.toResponse(assistantMessage),
    };
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
