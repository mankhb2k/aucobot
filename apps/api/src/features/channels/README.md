# `features/channels/` — Social **OAuth của user**

> **💡 Planned** — Khớp architecture: feature `facebook` / `tiktok` — OAuth + đăng ký MCP tools social; HTTP thuần ở [`social-providers`](../../../../packages/social-providers/README.md).

## Ý tưởng

Mỗi user kết nối Page/TikTok của **họ**. Token mã hoá trong DB (`SocialAccount` + `TOKEN_ENCRYPTION_KEY`).

| | **Channels** (đây) | **`tools/web-search`** |
|--|--------------------|------------------|
| Secret | Token **user** (OAuth) | API key **platform** (Tavily…) |
| Feature id | `facebook`, `tiktok` | `web-search` |
| Tool MCP | `publish_post`, `list_connected_accounts`, insights… | `web_search` |

**Vì sao `channels/` KHÔNG gộp vào `tools/`** (dù cả hai đều là "kết nối ngoài"): `facebook`/`tiktok` là feature nặng — OAuth flow, webhook, nhiều endpoint, refresh token — không phải "tool nhỏ gọi 1 phát" như `web_search`/`read_document`. `tools/` gom các tool đơn giản (kể cả loại cần platform key) vì số lượng còn ít; nếu `channels/` sau này có thêm nhiều social provider nhỏ, có thể xét lại, nhưng hiện tại giữ tách biệt.

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
| Search bằng Tavily / đọc tài liệu | [`features/tools/web-search`](../tools/web-search/README.md), [`features/tools/read-document`](../tools/read-document/README.md) |
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
- [`features/tools/README.md`](../tools/README.md)
