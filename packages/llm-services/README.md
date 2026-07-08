# `llm-services/` — LLM provider (Together AI)

> **✅ Scaffold** — Vercel AI SDK + Together. Phase A: non-stream `generateText`.

## Vai trò

Wrapper **framework-agnostic** gọi Together AI — không Nest, không HTTP.

| Làm | Không làm |
|-----|-----------|
| `createTogetherProvider`, `generateTextWithTogether` | Agent persona / routing (→ `core/agents`) |
| Default model constant | Persist messages, auth |
| 💡 sau: `streamText`, `generateObject` | Import trực tiếp trong controller |

Runtime chat orchestration: [`apps/api/src/features/ai-orchestration/`](../apps/api/src/features/ai-orchestration/README.md).

## Files

| File | Export |
|------|--------|
| `src/index.ts` | `DEFAULT_TOGETHER_MODEL`, `createTogetherProvider`, `generateTextWithTogether` |

## Model (đã chốt dev)

```typescript
DEFAULT_TOGETHER_MODEL = "Qwen/Qwen2.5-7B-Instruct-Turbo";
```

Override per-call qua `options.model` hoặc env `TOGETHER_MODEL` khi wire API.

## Dependencies

| Package | Vai trò |
|---------|---------|
| `ai` | Vercel AI SDK — `generateText`, (sau) `streamText` |
| `@ai-sdk/togetherai` | Together provider |
| `@aucobot/shared` | 💡 Zod schemas cho structured output |

## Env (consumer truyền vào)

| Env | Ghi chú |
|-----|---------|
| `TOGETHER_API_KEY` | **Server-only** — api đọc qua ConfigService, truyền vào hàm |

## Phase roadmap

| Phase | Mode | SDK |
|-------|------|-----|
| **A** (hiện tại) | Non-stream | `generateText` |
| **B** | Stream chat UX | `streamText` |
| **C** | Tool calling | `streamText` + tools từ `mcp-core` |

## Quy tắc

| Được | Cấm |
|------|-----|
| Thêm helper LLM thuần (provider-agnostic interface 💡) | Hardcode API key trong package |
| Unit test mock `generateText` | Gọi Prisma / Redis |

## Consumer

- `apps/api/src/features/ai-orchestration/` — 💡 planned
- Scripts one-off / eval — optional

## Build

```bash
pnpm --filter @aucobot/llm-services build
```
