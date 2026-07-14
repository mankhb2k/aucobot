# Web search — plugin `web-search`

> **💡 Planned** — Feature id: `web-search`. MCP tools knowledge/research trong [`aucobot-architecture.md`](../../../../../aucobot-architecture.md).

## Đảm nhiệm

Cho Agent **nghiên cứu thị trường / trend / competitor** khi chat — gọi search API bằng **platform key**, không cần user OAuth.

| Tool (architecture) | Việc |
|---------------------|------|
| `web_search` | Trend, competitor, tham khảo thị trường |
| `web_fetch` 💡 | Lấy nội dung URL (nếu ship cùng feature) |

## Phụ thuộc

| Layer | Vai trò |
|-------|---------|
| Env | `TAVILY_API_KEY` (hoặc Serper) |
| `ENABLED_FEATURES` | phải có `web-search` |
| core `agents` | Agent mới attach được tool (architecture: phụ thuộc core agents) |
| `mcp-core` 💡 | Định nghĩa tool schema; feature này register khi enable |

## Không làm

- Đăng bài social → `channels` + `social-providers`
- Đọc file library → feature `documents` / tool `read_document`
- Queue / Bot nền → `workflow`

Cha: [`../README.md`](../README.md) (nhóm integrations).
