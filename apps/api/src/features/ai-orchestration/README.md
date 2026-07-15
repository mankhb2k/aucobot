# AI orchestration

> Plugin id: `ai-orchestration`. Together via `@aucobot/llm-services` + Vercel AI SDK.

## Vai trò

Runtime LLM — gọi Together, **không** định nghĩa agent (xem [`core/agents/`](../../core/agents/README.md)).

| Làm | Không làm |
|-----|-----------|
| `generateText` / `streamText` với tools + multi-step | Seed AucoAgent, CRUD user agent |
| Resolve tools từ `PluginRegistry` theo `enabledSkillGroups` | HTTP route trực tiếp (delegate từ conversations messages) |
| Emit usage + tool lifecycle qua MessagesService → WS | Persist tool message parts (ephemeral UI only) |

## Phase C — Tool calling (MVP)

| Quyết định | Chọn |
|------------|------|
| Engine | `streamText` + `tools` + `stopWhen: stepCountIs(~5)` |
| Tools | `web_search`, `read_document`, `update_agent_memory` (skill group `knowledge`) |
| UI | WS `tool.started` / `tool.finished` / `tool.error` → `AgentActivity` |
| Message DB | Chỉ text reply cuối |

Non-stream `complete()` vẫn plain text (không tools).

## Env

| Env | Ghi chú |
|-----|---------|
| `TOGETHER_API_KEY` | Server-only |
| `TOGETHER_MODEL` | Optional; default Qwen 2.5 7B |
| `ENABLED_FEATURES` | Include `ai-orchestration` (+ `documents`, `web-search` nếu cần) |

## Tham chiếu

- [`packages/llm-services`](../../../../packages/llm-services/src/index.ts)
- [`core/plugins/`](../../core/plugins/) — PluginRegistry
- [`features/tools/`](../tools/README.md)
- [`core/agents/README.md`](../../core/agents/README.md)
