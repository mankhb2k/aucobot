# AI orchestration

> **💡 Planned** — Together / Vercel AI SDK, agent chat. Plugin id: `ai-orchestration`.

## Vai trò

Runtime LLM — gọi Together qua `@aucobot/llm-services`, **không** định nghĩa agent (xem [`core/agents/`](../../core/agents/README.md)).

| Làm | Không làm |
|-----|-----------|
| `generateText` / `streamText` với model env | Seed AucoAgent, CRUD user agent |
| Nhận `system` + `messages[]` → trả reply | HTTP route trực tiếp (delegate từ conversations messages) |
| Log token usage 💡 | Tool calling (phase sau) |

## Phase A — AucoAgent (đã chốt)

| Quyết định | Chọn |
|------------|------|
| Model default | `Qwen/Qwen2.5-7B-Instruct-Turbo` (`packages/llm-services`) |
| Response mode | **Non-stream** — `generateText`, JSON `{ reply }` một lần |
| Lý do | Phase này chỉ validate API pipeline; UI/UX stream defer phase sau |
| Stream | **Phase B** — `streamText` + WSS `message.chunk` / `message.done` |

### API contract (phase A)

```text
POST /api/conversations/:id/messages
  Body:  { "content": "..." }
  Response 201: {
    "userMessage": { ... },
    "assistantMessage": { "content": "..." }
  }
```

Together gọi qua Vercel AI SDK; assistant message persist sau khi có full text.

## Env (planned)

| Env | Ghi chú |
|-----|---------|
| `TOGETHER_API_KEY` | Server-only |
| `TOGETHER_MODEL` | Optional override; default Qwen 2.5 7B |

Bật module: `ENABLED_FEATURES=ai-orchestration` (khi đăng ký trong `feature-loader.ts`).

## Tham chiếu

- [`packages/llm-services`](../../../../packages/llm-services/src/index.ts)
- [`core/agents/README.md`](../../core/agents/README.md) — AucoAgent identity + resolve
