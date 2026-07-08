import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service";

import type { Conversation } from "@aucobot/database";

/**
 * Single authorization checkpoint for a conversation.
 *
 * MVP (Vòng 1): owner-only — `ownerId === userId` (cột hiện tên `userId`).
 * Seam: khi thêm ConversationMember (Vòng 2) / workspace RBAC (Vòng 3),
 * CHỈ sửa method này — không đụng service/controller gọi nó.
 */
@Injectable()
export class ConversationAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async assert(userId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return conversation;
  }
}
