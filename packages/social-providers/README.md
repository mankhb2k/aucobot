# `social-providers/` — Facebook & TikTok API

> **💡 Planned** — Abstraction gọi Graph API / TikTok Marketing API. Chưa implement.

## Vai trò

Lớp **HTTP + types** cho social platform — **không** OAuth flow UI, **không** Nest module.

| Làm (planned) | Không làm |
|---------------|-----------|
| Publish post, read insights, parse response (Zod) | JWT session, user CRUD |
| Token từ DB (`SocialAccount`) do caller inject | Import `apps/api` features trực tiếp |

OAuth và lưu token: `apps/api/src/features/channels/` (Facebook, TikTok).

## Planned structure

```text
social-providers/
  src/
    facebook/     # Graph API client
    tiktok/       # Marketing API client
    types.ts      # Shared DTO
    index.ts
```

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| Pure functions / class client nhận `accessToken` | Business approval queue |
| Validate response ngoài bằng Zod | MCP tool schema (→ `mcp-core`) |

## Consumer (planned)

| Package / app | Vai trò |
|---------------|---------|
| `packages/mcp-core` | Bọc thành AI SDK tools |
| `apps/api/src/features/channels/facebook` | OAuth + gọi client |
| `apps/api/src/features/publishing` | Schedule / publish job |

## Tham chiếu

- [`mcp-core/README.md`](../mcp-core/README.md)
- [`aucobot-architecture.md`](../../aucobot-architecture.md) — Tech Stack Social
