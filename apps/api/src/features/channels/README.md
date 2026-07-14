# `features/channels/` — Social **OAuth của user**

> **💡 Planned** — Khớp architecture: feature `facebook` / `tiktok` — OAuth + đăng ký MCP tools social; HTTP thuần ở [`social-providers`](../../../../packages/social-providers/README.md).

## Ý tưởng

Mỗi user kết nối Page/TikTok của **họ**. Token mã hoá trong DB (`SocialAccount` + `TOKEN_ENCRYPTION_KEY`).

| | **Channels** (đây) | **Integrations** |
|--|--------------------|------------------|
| Secret | Token **user** (OAuth) | API key **platform** (Tavily…) |
| Feature id | `facebook`, `tiktok` | `web-search` |
| Tool MCP | `publish_post`, `list_connected_accounts`, insights… | `web_search` |

```text
User OAuth → channels/facebook → lưu SocialAccount
Agent tool publish_post → mcp-core → social-providers (kèm accessToken từ DB)
```

## Đảm nhiệm

- OAuth flow + callback (Meta / TikTok)
- Lưu / refresh token per user
- Đăng ký MCP social tools khi feature bật (`FeaturePlugin.mcpTools`)
- Gọi client [`social-providers`](../../../../packages/social-providers/README.md) với token inject

## Không đảm nhiệm

| Việc | Ở đâu |
|------|--------|
| HTTP Graph/TikTok thuần | `packages/social-providers` |
| Search bằng Tavily | [`features/integrations`](../integrations/README.md) |
| Schedule / publish job / approval | `publishing` / `approvals` hoặc [`workflow`](../workflow/README.md) |
| Định nghĩa tool schema chung | `packages/mcp-core` |

## Con (scaffold)

| Thư mục | Plugin id |
|---------|-----------|
| [`facebook/`](./facebook/README.md) | `facebook` |
| `tiktok/` 💡 | `tiktok` |

```env
ENABLED_FEATURES=facebook,tiktok,...
META_APP_ID=
META_APP_SECRET=
TOKEN_ENCRYPTION_KEY=
```

## Tham chiếu

- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — MCP social tools; bảng features; env OAuth
- [`features/integrations/README.md`](../integrations/README.md)
