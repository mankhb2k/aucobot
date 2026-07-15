import { Injectable } from "@nestjs/common";

import { SKILL_GROUP_KNOWLEDGE, TOOL_UI_LABELS } from "@aucobot/shared";

import type { ToolSet } from "ai" with { "resolution-mode": "import" };

export type RegisteredToolMeta = {
  name: string;
  skillGroup: string;
  label: string;
};

export type ToolFactoryContext = {
  ownerId: string;
  agentId: string;
  conversationId: string;
};

type ToolFactory = (ctx: ToolFactoryContext) => ToolSet[string];

@Injectable()
export class PluginRegistry {
  private readonly metas = new Map<string, RegisteredToolMeta>();
  private readonly factories = new Map<string, ToolFactory>();

  register(entry: RegisteredToolMeta & { create: ToolFactory }): void {
    this.metas.set(entry.name, {
      name: entry.name,
      skillGroup: entry.skillGroup,
      label: entry.label,
    });
    this.factories.set(entry.name, entry.create);
  }

  unregister(name: string): void {
    this.metas.delete(name);
    this.factories.delete(name);
  }

  getToolsForSkillGroups(skillGroups: string[], ctx: ToolFactoryContext): ToolSet {
    const allow = new Set(skillGroups);
    const set: ToolSet = {};

    for (const [name, meta] of this.metas) {
      if (!allow.has(meta.skillGroup)) continue;
      const factory = this.factories.get(name);
      if (!factory) continue;
      set[name] = factory(ctx);
    }

    return set;
  }

  getLabel(name: string): string {
    return (
      this.metas.get(name)?.label ??
      TOOL_UI_LABELS[name as keyof typeof TOOL_UI_LABELS] ??
      name
    );
  }

  listMeta(skillGroups?: string[]): RegisteredToolMeta[] {
    const allow = skillGroups ? new Set(skillGroups) : null;
    return [...this.metas.values()].filter((meta) =>
      allow ? allow.has(meta.skillGroup) : true,
    );
  }
}

export { SKILL_GROUP_KNOWLEDGE };
