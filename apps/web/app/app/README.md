# `app/app/` — Chat shell (`app.aucobot.com` / dev `localhost:8386/app`)

App chat **kiểu Telegram** — user trò chuyện với AI. Một route `/app` — chọn hội thoại qua **hash**.

## URL

| URL | Mô tả |
|-----|--------|
| `…/app` | Shell: empty state hoặc chưa chọn chat |
| `…/app#clx9abc` | Mở **Conversation** (Room hoặc Session) |

**Room (Phòng):** group-like — tên + mô tả tùy chọn, giống Telegram New Channel.  
**Session (Phiên):** chat 1 việc cụ thể với AI.

## Files

```text
app/app/
  page.tsx                          # RSC auth guard → ClientAppShell
  _components/
    ClientAppShell/                 # Khung 3 cột + điều phối state
    Chat/                           # (reserved) container chat
    ChatPanel/                      # (reserved) container panel
    Sidebar/                        # (reserved) container sidebar
```

## Hash routing — ✅

- `hooks/thread/use-conversation-id-from-hash.ts`
- `utils/chat/conversation-hash.ts`

## Phase 1 — ✅

- Empty state + **Tạo phòng** / **Phiên mới** (form Telegram-style)
- `use-conversation-list` → `GET /api/conversations`
- `use-active-conversation` → `GET /api/conversations/:id`
- Meta panel placeholder (chưa có tin nhắn / composer)

## Phase 2+ — 🔜

- Message model, composer, AI agent, WebSocket

Xem [`aucobot-architecture.md`](../../../../aucobot-architecture.md).
