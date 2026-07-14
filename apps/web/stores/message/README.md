# `stores/message/`

## `message.store.ts`

| State | Mô tả |
|-------|--------|
| `byConversationId` | Map conversation id → UI messages |
| `streamingByConversationId` | Partial agent text đang stream |

## Actions (chỉ projection)

- `setMessages(conversationId, messages)`
- `upsertMessage(conversationId, message)`
- `appendChunk(conversationId, messageId, delta)`
- `finalizeStream(conversationId, streamingId, message)`
- `clearStreaming` / `clearConversation`
