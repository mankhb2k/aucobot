# `lib/stream/`

**WebSocket** — tách khỏi REST (`lib/api`). Đã chốt: không SSE, không GraphQL.

## Endpoint

```text
WSS {NEXT_PUBLIC_API_URL}/api/ws/conversations/:conversationId
```

Auth: cookie `httpOnly` lúc HTTP Upgrade (cùng site `app.` / `api.`).

## Files

| File | Mô tả |
|------|--------|
| `agent-stream-client.ts` | Connect, reconnect backoff, ping/pong, parse Zod |

## Event envelope (server → client)

| `type` | Mục đích |
|--------|----------|
| `message.chunk` | Stream từng mảnh agent reply |
| `message.done` | Kết thúc tin |
| `approval.updated` | Trạng thái duyệt đổi |
| `job.status` | Job đăng bài: scheduled → published / failed |
| `pong` | Trả `ping` keepalive |

Shape Zod trong `@aucobot/shared` — web chỉ parse và đẩy vào hooks.

## Luồng

```text
REST POST (gửi tin, duyệt)  →  API xử lý
WS events                   →  lib/stream → hooks → stores → components
```

## Cấm

- Import React, stores, components.
- Business logic trên client.
