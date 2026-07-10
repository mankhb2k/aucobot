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
  page.tsx                          # Static shell → ClientAppShell (SPA, không cookies()/fetch server)
  _components/
    ClientAppShell/                 # Khung 3 cột + điều phối state + auth guard client
    Chat/                           # (reserved) container chat
    ChatPanel/                      # (reserved) container panel
    Sidebar/                        # (reserved) container sidebar
```

## Auth guard — SPA, không SSR (§0.1 `.agent/rule.md`)

`app/app` luôn **client-only** — không dùng `cookies()`/redirect server để giữ route static, tránh round-trip server-to-server trước byte đầu tiên:

1. **Edge (`proxy.ts`)** — chỉ check **có cookie hay không** (không gọi API) → thiếu cookie → redirect `/login` ngay.
2. **Client (`hooks/auth/use-auth-guard.ts`)** — `ClientAppShell` gọi `authApi.getMe()` xác thực token còn hợp lệ → không hợp lệ → `window.location.assign` sang `/login` (domain marketing).

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
