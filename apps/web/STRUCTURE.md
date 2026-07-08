# Aucobot Web — Sơ đồ folder (kế hoạch)

> **Frontend mỏng:** Next.js + Zustand chỉ stream & hiển thị. Não nghiệp vụ ở `apps/api`.  
> **Domain:** `aucobot.com` = marketing + auth · `app.aucobot.com` = chat (`proxy.ts` rewrite).  
> Chi tiết: [`.agent/rule.md`](./.agent/rule.md) · [`../../aucobot-architecture.md`](../../aucobot-architecture.md)

## Cây thư mục (rút gọn)

```text
apps/web/
├── proxy.ts
├── app/
│   ├── site/                 # aucobot.com — landing + login/register ✅
│   └── app/                  # app.aucobot.com — ClientAppShell ✅
│       ├── page.tsx
│       └── _components/ClientAppShell/
├── hooks/thread/
│   └── use-department-id-from-hash.ts ✅
├── utils/chat/
│   └── department-hash.ts ✅
├── components/               # layout/, chat/ 🔜
└── lib/host/
```

## Chat URL (Telegram-style)

```text
app.aucobot.com/              thread list, chưa chọn
app.aucobot.com/#1244557231   chat department
```

## Subdomain (dev)

| Host | Nội dung |
|------|----------|
| `localhost:8386` | Marketing + `/login`, `/register` |
| `app.localhost:8386` | Chat shell |

**Env:** API đọc `../../.env` (local, gitignored) · mẫu repo: `.env.dev.example` / `.env.pro.example` · Next: `apps/web/.env.local` (mẫu: `.env.local.example`).

## Trạng thái

| Phần | Trạng thái |
|------|------------|
| Subdomain, auth, hash shell | ✅ scaffold |
| API departments + messages | 🔜 |
| Stream WebSocket | 🔜 |
