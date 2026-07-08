import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service";

import type { Agent } from "@aucobot/database";

@Injectable()
export class AgentResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveForSession(conversationId: string): Promise<Agent> {
    const member = await this.prisma.conversationMember.findFirst({
      where: { conversationId, isDefault: true },
      include: { agent: true },
    });

    if (!member?.agent) {
      throw new NotFoundException("No default assistant is bound to this session");
    }

    return member.agent;
  }
}
