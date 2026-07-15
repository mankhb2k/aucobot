import { Injectable, OnModuleInit } from "@nestjs/common";

import { createAucobotTool, updateAgentMemoryInputSchema } from "@aucobot/mcp-core";
import { SKILL_GROUP_KNOWLEDGE, TOOL_UI_LABELS } from "@aucobot/shared";

import { PrismaService } from "../../../core/database/prisma.service";
import { PluginRegistry } from "../../../core/plugins/plugin.registry";

@Injectable()
export class UpdateAgentMemoryService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: PluginRegistry,
  ) {}

  onModuleInit(): void {
    this.registry.register({
      name: "update_agent_memory",
      skillGroup: SKILL_GROUP_KNOWLEDGE,
      label: TOOL_UI_LABELS.update_agent_memory,
      create: (ctx) =>
        createAucobotTool({
          name: "update_agent_memory",
          description:
            "Save a durable insight learned about the user or conversation so it can be recalled later.",
          skillGroup: SKILL_GROUP_KNOWLEDGE,
          inputSchema: updateAgentMemoryInputSchema,
          execute: async (input) => {
            const scope = input.scope ?? "conversation";
            const row = await this.prisma.agentMemory.create({
              data: {
                ownerId: ctx.ownerId,
                agentId: ctx.agentId,
                conversationId: scope === "conversation" ? ctx.conversationId : null,
                content: input.insight.trim(),
              },
            });
            return {
              id: row.id,
              saved: true,
              scope,
              preview: input.insight.trim().slice(0, 120),
            };
          },
        }),
    });
  }
}
