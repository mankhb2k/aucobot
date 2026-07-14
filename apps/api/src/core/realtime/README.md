# Giao thức realtime — REST + WebSocket (đã chốt)

> Chi tiết: [`aucobot-architecture.md`](../../../../aucobot-architecture.md#giao-thức-client-web-đã-chốt-rest--websocket).

## Đã chốt

- **REST** — mọi lệnh user, CRUD, snapshot
- **WebSocket** — push realtime (stream agent, job, approval)
- **Không** GraphQL, **không** SSE

## WebSocket gateway

```text
WSS /api/ws/conversations/:conversationId
```

- Nest injectable `ConversationsGateway` + package `ws` (HTTP Upgrade trên cùng server)
- Auth: cookie `access_token` lúc Upgrade — **cấm** JWT trên query
- Access: `ConversationAccessService.assert`
- Event envelope: `{ type, payload, conversationId, timestamp }` — Zod trong `@aucobot/shared`

## Event types

| `type` | Mục đích |
|--------|----------|
| `message.chunk` | Agent reply stream |
| `message.done` | Tin hoàn tất (persist Postgres rồi) |
| `approval.updated` | Duyệt / từ chối (schema sẵn, emit sau) |
| `job.status` | Lịch đăng bài (schema sẵn, emit sau) |
| `ping` / `pong` | Keepalive |

## Files

| File | Vai trò |
|------|---------|
| `conversations.gateway.ts` | Upgrade auth + rooms + emit |
| `conversation-events.port.ts` | Port inject vào MessagesService |
| `realtime.module.ts` | Wire DI |
