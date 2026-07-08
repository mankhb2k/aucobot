import { Injectable, OnModuleInit } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service";
import {
  AUCO_AGENT_INSTRUCTIONS,
  AUCO_AGENT_NAME,
  QUICK_ASSISTANT_PRESET_ID,
} from "../../agent.constants";

import type { Agent } from "@aucobot/database";

@Injectable()
export class SystemAgentsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.seedQuickAssistant();
  }

  seedQuickAssistant(): Promise<Agent> {
    return this.prisma.agent.upsert({
      where: { presetId: QUICK_ASSISTANT_PRESET_ID },
      create: {
        isSystem: true,
        presetId: QUICK_ASSISTANT_PRESET_ID,
        name: AUCO_AGENT_NAME,
        instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
      },
      update: {
        isSystem: true,
        name: AUCO_AGENT_NAME,
        instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
      },
    });
  }

  async getQuickAssistant(): Promise<Agent> {
    const agent = await this.prisma.agent.findUnique({
      where: { presetId: QUICK_ASSISTANT_PRESET_ID },
    });

    if (!agent) {
      return this.seedQuickAssistant();
    }

    return agent;
  }

  findByPresetId(presetId: string): Promise<Agent | null> {
    return this.prisma.agent.findUnique({ where: { presetId } });
  }
}
