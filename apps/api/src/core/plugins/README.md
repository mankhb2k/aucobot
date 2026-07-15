# `plugins/` — Plugin platform

Contract chung để `src/features/*` cắm tools vào core: `PluginRegistry` đăng ký factory theo skill group; orchestration đọc registry theo `agent.enabledSkillGroups`.

## Single registration path

**Registry ở đây là nơi DUY NHẤT giữ danh sách chat tools.** Mỗi feature module tự `register` lúc `onModuleInit`.

```text
tools/web-search            ──►  ┐
tools/read-document          ─►  ├──►  PluginRegistry  ──►  ai-orchestration
tools/builtin                ──►  │         (skillGroups filter)
tools/update-agent-memory    ──►  ┘
```

## Files

| File | Vai trò |
|------|---------|
| `plugin.registry.ts` | `register` / `getToolsForSkillGroups` / `getLabel` |
| `plugins.module.ts` | Global Nest module |
| `llm-completion.port.ts` | Port stream/complete (+ tool callbacks) |

Loader feature modules: [`features/feature-registry.ts`](../../features/feature-registry.ts).
