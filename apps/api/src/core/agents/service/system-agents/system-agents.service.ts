import { Injectable, OnModuleInit } from "@nestjs/common";

import { SKILL_GROUP_KNOWLEDGE } from "@aucobot/shared";

import { PrismaService } from "../../../database/prisma.service";
import {
  AUCO_AGENT_INSTRUCTIONS,
  AUCO_AGENT_NAME,
  MOTHER_INSTRUCTIONS,
  MOTHER_NAME,
  MOTHER_PRESET_ID,
  ORCHESTRATOR_INSTRUCTIONS,
  ORCHESTRATOR_NAME,
  ORCHESTRATOR_PRESET_ID,
  QUICK_ASSISTANT_PRESET_ID,
} from "../../agent.constants";

import type { Agent, Prisma } from "@aucobot/database";

type SystemSeedDef = {
  presetId: string;
  name: string;
  role: string;
  tonePreset: string;
  instructionsCompiled: string;
  enabledSkillGroups?: string[];
};

const SYSTEM_SEEDS: SystemSeedDef[] = [
  {
    presetId: QUICK_ASSISTANT_PRESET_ID,
    name: AUCO_AGENT_NAME,
    role: "Quick assistant",
    tonePreset: "friendly",
    instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
    enabledSkillGroups: [SKILL_GROUP_KNOWLEDGE],
  },
  {
    presetId: ORCHESTRATOR_PRESET_ID,
    name: ORCHESTRATOR_NAME,
    role: "Room orchestrator",
    tonePreset: "friendly",
    instructionsCompiled: ORCHESTRATOR_INSTRUCTIONS,
  },
  {
    presetId: MOTHER_PRESET_ID,
    name: MOTHER_NAME,
    role: "Agent factory",
    tonePreset: "friendly",
    instructionsCompiled: MOTHER_INSTRUCTIONS,
  },
];

@Injectable()
export class SystemAgentsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.seedAllSystemAgents();
  }

  async seedAllSystemAgents(): Promise<void> {
    for (const def of SYSTEM_SEEDS) {
      await this.upsertSystemAgent(def);
    }
  }

  seedQuickAssistant(): Promise<Agent> {
    return this.upsertSystemAgent(SYSTEM_SEEDS[0]);
  }

  seedOrchestrator(): Promise<Agent> {
    return this.upsertSystemAgent(SYSTEM_SEEDS[1]);
  }

  seedMother(): Promise<Agent> {
    return this.upsertSystemAgent(SYSTEM_SEEDS[2]);
  }

  getQuickAssistant(): Promise<Agent> {
    return this.getOrSeedSystem(QUICK_ASSISTANT_PRESET_ID, () =>
      this.seedQuickAssistant(),
    );
  }

  getOrchestrator(): Promise<Agent> {
    return this.getOrSeedSystem(ORCHESTRATOR_PRESET_ID, () => this.seedOrchestrator());
  }

  getMother(): Promise<Agent> {
    return this.getOrSeedSystem(MOTHER_PRESET_ID, () => this.seedMother());
  }

  findSystemByPresetId(presetId: string): Promise<Agent | null> {
    return this.prisma.agent.findFirst({
      where: { isSystem: true, presetId },
    });
  }

  /** @deprecated Prefer findSystemByPresetId — presetId is no longer unique. */
  findByPresetId(presetId: string): Promise<Agent | null> {
    return this.findSystemByPresetId(presetId);
  }

  private async getOrSeedSystem(
    presetId: string,
    seed: () => Promise<Agent>,
  ): Promise<Agent> {
    const existing = await this.findSystemByPresetId(presetId);
    if (existing) {
      return existing;
    }
    return seed();
  }

  private async upsertSystemAgent(def: SystemSeedDef): Promise<Agent> {
    const data: Prisma.AgentUncheckedUpdateInput = {
      isSystem: true,
      name: def.name,
      role: def.role,
      tonePreset: def.tonePreset,
      instructionsCompiled: def.instructionsCompiled,
      enabledSkillGroups: def.enabledSkillGroups ?? [],
      ownerId: null,
    };

    const existing = await this.findSystemByPresetId(def.presetId);
    if (existing) {
      return this.prisma.agent.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.agent.create({
      data: {
        isSystem: true,
        presetId: def.presetId,
        name: def.name,
        role: def.role,
        tonePreset: def.tonePreset,
        instructionsCompiled: def.instructionsCompiled,
        enabledSkillGroups: def.enabledSkillGroups ?? [],
        ownerId: null,
      },
    });
  }
}
