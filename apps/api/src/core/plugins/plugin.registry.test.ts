import { SKILL_GROUP_KNOWLEDGE } from "@aucobot/shared";

import { PluginRegistry } from "./plugin.registry";

describe("PluginRegistry", () => {
  it("filters tools by skill group", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "web_search",
      skillGroup: SKILL_GROUP_KNOWLEDGE,
      label: "Đang tìm trên web…",
      create: () =>
        ({
          description: "search",
          inputSchema: {},
          execute: () => Promise.resolve({ ok: true }),
        }) as never,
    });
    registry.register({
      name: "other_tool",
      skillGroup: "social",
      label: "Other",
      create: () =>
        ({
          description: "other",
          inputSchema: {},
          execute: () => Promise.resolve({ ok: true }),
        }) as never,
    });

    const ctx = {
      ownerId: "u1",
      agentId: "a1",
      conversationId: "c1",
    };

    const knowledge = registry.getToolsForSkillGroups([SKILL_GROUP_KNOWLEDGE], ctx);
    expect(Object.keys(knowledge)).toEqual(["web_search"]);

    const empty = registry.getToolsForSkillGroups([], ctx);
    expect(Object.keys(empty)).toEqual([]);
  });

  it("returns UI label from registry or shared map", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "web_search",
      skillGroup: SKILL_GROUP_KNOWLEDGE,
      label: "Đang tìm trên web…",
      create: () => ({}) as never,
    });

    expect(registry.getLabel("web_search")).toBe("Đang tìm trên web…");
    expect(registry.getLabel("unknown_tool")).toBe("unknown_tool");
  });
});
