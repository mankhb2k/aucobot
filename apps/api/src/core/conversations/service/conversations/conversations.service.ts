import { Injectable } from "@nestjs/common";

import { SystemAgentsService } from "../../../agents/service/system-agents/system-agents.service";
import { PrismaService } from "../../../database/prisma.service";
import { ConversationAccessService } from "../conversation-access/conversation-access.service";

import type { Conversation } from "@aucobot/database";
import type {
  ConversationListResponse,
  ConversationResponse,
  CreateConversationInput,
} from "@aucobot/shared";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ConversationAccessService,
    private readonly systemAgents: SystemAgentsService,
  ) {}

  async listForUser(userId: string): Promise<ConversationListResponse> {
    const rows = await this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return { items: rows.map((row) => this.toResponse(row)) };
  }

  async createForUser(
    userId: string,
    input: CreateConversationInput,
  ): Promise<ConversationResponse> {
    const description = input.description?.trim() || null;

    if (input.type === "session") {
      const quickAssistant = await this.systemAgents.getQuickAssistant();

      const row = await this.prisma.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
          data: {
            userId,
            type: input.type,
            title: input.title.trim(),
            description,
          },
        });

        await tx.conversationMember.create({
          data: {
            conversationId: conversation.id,
            agentId: quickAssistant.id,
            isDefault: true,
          },
        });

        return conversation;
      });

      return this.toResponse(row);
    }

    const orchestrator = await this.systemAgents.getOrchestrator();

    const row = await this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          userId,
          type: input.type,
          title: input.title.trim(),
          description,
        },
      });

      await tx.conversationMember.create({
        data: {
          conversationId: conversation.id,
          agentId: orchestrator.id,
          isDefault: true,
        },
      });

      return conversation;
    });

    return this.toResponse(row);
  }

  async getForUser(userId: string, id: string): Promise<ConversationResponse> {
    return this.toResponse(await this.access.assert(userId, id));
  }

  private toResponse(row: Conversation): ConversationResponse {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
