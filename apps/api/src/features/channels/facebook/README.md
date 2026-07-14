# Facebook channel — plugin `facebook`

> **💡 Planned** — OAuth Meta + MCP tools Facebook. Phụ thuộc core + [`social-providers`](../../../../../packages/social-providers/README.md).

## Đảm nhiệm

| Việc | Chi tiết |
|------|----------|
| OAuth Meta | `META_APP_ID` / `META_APP_SECRET` / redirect |
| Lưu Page token | `SocialAccount`, mã hoá |
| Đăng ký tools | vd. `list_connected_accounts`, `publish_post`, `get_page_insights` (architecture) |
| Publish thật | Qua `social-providers` + token user — thường sau approval |

## Không làm

- Tavily / web search → `features/integrations/web-search`
- BullMQ schedule → publishing / workflow
- Client Graph thuần không Nest → `packages/social-providers`

Cha: [`../README.md`](../README.md).
