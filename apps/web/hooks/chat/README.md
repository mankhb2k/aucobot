# `hooks/chat/`

| File | Vai trò |
|------|---------|
| `use-conversation-messages.ts` | REST list → `messageStore.setMessages` |
| `use-message-stream.ts` | `lib/stream` → `appendChunk` / `finalizeStream` |
| `use-send-message.ts` | Composer → `messagesApi.create` (REST) |

## Pattern

```text
REST POST  → API bắt đầu agent
WS message.chunk / message.done  → store patch
disconnect / reconnect → client backoff trong agent-stream-client
```

Không merge agent logic; không tự approve.
