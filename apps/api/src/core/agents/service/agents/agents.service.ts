import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import {
  SYSTEM_AGENT_PRESET_IDS,
  agentTonePresetSchema,
  type AgentDmResponse,
  type AgentListResponse,
  type AgentResponse,
  type CreateAgentInput,
  type MotherDmResponse,
} from "@aucobot/shared";

import { PrismaService } from "../../../database/prisma.service";
import { MOTHER_DM_DESCRIPTION, MOTHER_DM_TITLE } from "../../agent.constants";
import { PromptCompilerService } from "../prompt-compiler/prompt-compiler.service";
import { SystemAgentsService } from "../system-agents/system-agents.service";

import type { Agent, Conversation } from "@aucobot/database";

const SYSTEM_PRESET_SET = new Set<string>(SYSTEM_AGENT_PRESET_IDS);

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promptCompiler: PromptCompilerService,
    private readonly systemAgents: SystemAgentsService,
  ) {}

  async listForUser(userId: string): Promise<AgentListResponse> {
    const rows = await this.prisma.agent.findMany({
      where: { ownerId: userId, isSystem: false },
      orderBy: { updatedAt: "desc" },
    });

    return { items: rows.map((row) => this.toResponse(row)) };
  }

  async createForUser(userId: string, input: CreateAgentInput): Promise<AgentResponse> {
    const presetId = (input.presetId?.trim() || "custom").toLowerCase();

    if (SYSTEM_PRESET_SET.has(presetId)) {
      throw new BadRequestException(
        `Cannot create an agent with reserved system presetId "${presetId}"`,
      );
    }

    const instructionsCompiled = this.promptCompiler.compile({
      name: input.name,
      role: input.role,
      description: input.description,
      tonePreset: input.tonePreset,
      toneNotes: input.toneNotes,
      enabledSkillGroups: input.enabledSkillGroups,
    });

    const instructionsSource = {
      name: input.name,
      bio: input.bio ?? null,
      avatarUrl: input.avatarUrl ?? null,
      tonePreset: input.tonePreset,
      toneNotes: input.toneNotes ?? null,
      role: input.role,
      description: input.description ?? null,
      presetId,
      enabledSkillGroups: input.enabledSkillGroups,
    };

    const row = await this.prisma.agent.create({
      data: {
        ownerId: userId,
        isSystem: false,
        presetId,
        name: input.name.trim(),
        avatarUrl: input.avatarUrl ?? null,
        bio: input.bio?.trim() || null,
        role: input.role.trim(),
        description: input.description?.trim() || null,
        tonePreset: input.tonePreset,
        toneNotes: input.toneNotes?.trim() || null,
        enabledSkillGroups: input.enabledSkillGroups,
        instructionsSource,
        instructionsCompiled,
      },
    });

    return this.toResponse(row);
  }

  async getForUser(userId: string, id: string): Promise<AgentResponse> {
    const row = await this.prisma.agent.findFirst({
      where: { id, ownerId: userId, isSystem: false },
    });

    if (!row) {
      throw new NotFoundException("Agent not found");
    }

    return this.toResponse(row);
  }

  /**
   * Idempotent Mother DM Session — default member = AucoMother.
   * Messages use existing session path → Together (Qwen) via ai-orchestration.
   */
  async ensureMotherDm(userId: string): Promise<MotherDmResponse> {
    const mother = await this.systemAgents.getMother();
    const conversation = await this.ensureDmSession({
      userId,
      agentId: mother.id,
      title: MOTHER_DM_TITLE,
      description: MOTHER_DM_DESCRIPTION,
    });

    return {
      conversation: this.toConversationResponse(conversation),
      mother: this.toResponse(mother),
    };
  }

  /**
   * Idempotent DM Session for an owned user agent — chat/test via Together (Qwen).
   */
  async ensureAgentDm(userId: string, agentId: string): Promise<AgentDmResponse> {
    const agent = await this.prisma.agent.findFirst({
      where: { id: agentId, ownerId: userId, isSystem: false },
    });

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }

    const conversation = await this.ensureDmSession({
      userId,
      agentId: agent.id,
      title: agent.name,
      description: agent.bio ?? agent.description ?? `DM với ${agent.name}`,
    });

    return {
      conversation: this.toConversationResponse(conversation),
      agent: this.toResponse(agent),
    };
  }

  private async ensureDmSession(input: {
    userId: string;
    agentId: string;
    title: string;
    description: string | null;
  }): Promise<Conversation> {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        userId: input.userId,
        type: "session",
        members: {
          some: {
            isDefault: true,
            agentId: input.agentId,
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          userId: input.userId,
          type: "session",
          title: input.title,
          description: input.description,
        },
      });

      await tx.conversationMember.create({
        data: {
          conversationId: conversation.id,
          agentId: input.agentId,
          isDefault: true,
        },
      });

      return conversation;
    });
  }

  private toConversationResponse(row: Conversation): MotherDmResponse["conversation"] {
    return {
      id: row.id,
      type: "session",
      title: row.title,
      description: row.description,
      lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private toResponse(row: Agent): AgentResponse {
    const tonePreset = agentTonePresetSchema.catch("friendly").parse(row.tonePreset);

    return {
      id: row.id,
      ownerId: row.ownerId,
      isSystem: row.isSystem,
      presetId: row.presetId,
      name: row.name,
      avatarUrl: row.avatarUrl,
      bio: row.bio,
      role: row.role,
      description: row.description,
      tonePreset,
      toneNotes: row.toneNotes,
      enabledSkillGroups: row.enabledSkillGroups,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
