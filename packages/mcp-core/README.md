# `mcp-core/` — MCP tools cho AI agents

> **💡 Planned** — Tool definitions cho Vercel AI SDK / agent tool calling. Chưa implement.

## Vai trò

Định nghĩa **MCP-compatible tools** agent gọi lúc chat — bọc logic từ `social-providers` và platform khác.

```text
Agent (LLM) → tool call → mcp-core tool → social-providers / web-search / …
```

**Không** chứa OAuth, **không** queue worker — feature modules trong `apps/api/src/features/` orchestrate.

## Quan hệ packages

| Package | Vai trò |
|---------|---------|
| [`social-providers/`](../social-providers/README.md) | HTTP client FB/TikTok |
| **`mcp-core/`** (đây) | `tool()` schema + execute wrapper |
| [`llm-services/`](../llm-services/README.md) | Pass tools vào `streamText` |
| `apps/api/src/core/plugins/` | 💡 Registry — agent chỉ thấy tool của skill group bật |

## Planned tools (ví dụ)

| Tool | Nguồn |
|------|--------|
| `facebook_publish_post` | social-providers |
| `facebook_get_page_insights` | social-providers |
| `web_search` | feature `web-search` |
| `read_document` | feature `documents` 💡 |

Catalog gắn `enabledSkillGroups` trên `Agent` — xem [`core/agents/README.md`](../../apps/api/src/core/agents/README.md).

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| Tool pure — input Zod, output typed | Import Nest `Module` |
| Side-effect nguy hiểm → caller enforce approval | Agent tự đăng bài không queue duyệt |

## Consumer (planned)

- `apps/api/src/features/ai-orchestration/` — attach tools theo agent
- `ENABLED_FEATURES` bật feature → registry expose tool subset

## Tham chiếu

- [`apps/api/src/core/plugins/README.md`](../../apps/api/src/core/plugins/README.md)
- [`aucobot-architecture.md`](../../aucobot-architecture.md) — MCP tools section
