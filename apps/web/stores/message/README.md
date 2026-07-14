# `stores/message/`

## `message.store.ts`

| State | Mô tả |
|-------|--------|
| `byConversationId` | Map conversation id → UI messages |
| `streamingByConversationId` | Agent đang trả lời — UI chỉ hiện typing, ẩn partial text |

## Actions (chỉ projection)

- `setMessages(conversationId, messages)`
- `upsertMessage(conversationId, message)`
- `beginStreaming(conversationId)` — bật typing
- `appendChunk(conversationId, messageId, delta)` — gom token (ẩn)
- `finalizeStream(conversationId, streamingId, message)` — tắt typing + hiện bubble đủ
- `clearStreaming` / `clearConversation`
