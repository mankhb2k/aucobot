# `features/integrations/` — API bên thứ ba bằng **platform key**

> **💡 Planned** — Chưa implement. Khớp [`aucobot-architecture.md`](../../../../aucobot-architecture.md): feature kiểu `web-search` (Tavily/Serper), đăng ký MCP tool qua plugin registry.

## Ý tưởng (architecture)

Aucobot tách rõ **hai kiểu “kết nối ngoài”**:

| | **Integrations** (folder này) | **Channels** |
|--|-------------------------------|--------------|
| Ai giữ secret | **Platform** (Aucobot) — 1 API key trên server | **User** — OAuth token trong `SocialAccount` |
| Ví dụ | Tavily / Serper (`TAVILY_API_KEY`) | Facebook / TikTok (`META_*`, `TIKTOK_*`) |
| Feature id (env) | `web-search` (và tương lai tương tự) | `facebook`, `tiktok` |
| Package HTTP | Client riêng (hoặc thin fetch) | [`social-providers`](../../../../packages/social-providers/README.md) |
| Tool MCP lộ cho Agent | `web_search`, `web_fetch` (knowledge & research) | `publish_post`, `get_page_insights`, … |

```text
ENABLED_FEATURES=...,web-search
TAVILY_API_KEY=...

Agent chat → tool web_search → features/integrations/web-search
                              → gọi Tavily bằng key platform
```

**Nguyên tắc plugin:** bật `web-search` → đăng ký tool vào registry; tắt feature → Agent không còn tool đó. Core/`ai-orchestration` không hard-code Tavily.

## Đảm nhiệm

| Việc | Chi tiết |
|------|----------|
| Nest module per integration | Ví dụ `web-search.module.ts`, id plugin `web-search` |
| Đăng ký MCP tools | `web_search` (trend, competitor, tham khảo) — xem bảng MCP knowledge trong architecture |
| Giữ / đọc env API key platform | Không lưu per-user OAuth |
| Gọi vendor API | Search / fetch URL |
| Bật/tắt độc lập | `ENABLED_FEATURES` — gỡ integration không ảnh hưởng FB/TikTok |

## Không đảm nhiệm

| Việc | Để ở đâu |
|------|----------|
| OAuth Meta/TikTok, lưu token user | [`features/channels`](../channels/README.md) |
| Abstraction Graph/TikTok API | [`packages/social-providers`](../../../../packages/social-providers/README.md) |
| Schema tool tái dùng (AI SDK) | [`packages/mcp-core`](../../../../packages/mcp-core/README.md) |
| Wire tool vào Agent theo skill group | [`features/tools`](../tools/README.md) + plugin `onEnable` |
| Upload tài liệu / `read_document` | Feature `documents` (architecture) — **không** gộp vào integrations |
| Queue publish / approval | [`features/workflow`](../workflow/README.md) |

## Cấu trúc hiện tại (scaffold)

```text
features/integrations/
  README.md                 # (file này)
  web-search/               # plugin id: web-search
    README.md
```

Folder cha `integrations/` = **nhóm** “vendor dùng key của Aucobot”.  
**Plugin bật/tắt thật** = từng con (`web-search`), đúng bảng feature trong architecture — không cần `ENABLED_FEATURES=integrations`.

## Con: `web-search`

Xem [`web-search/README.md`](./web-search/README.md).

Env (architecture):

```env
ENABLED_FEATURES=...,web-search
TAVILY_API_KEY=
```

(Alternatives 💡: Serper — cùng pattern, đổi client.)

## Tham chiếu

- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — MCP knowledge tools; bảng `src/features`; env `TAVILY_API_KEY`
- [`features/channels/README.md`](../channels/README.md) — đối lập OAuth user
- [`features/tools/README.md`](../tools/README.md) — tool lúc chat
- [`packages/mcp-core/README.md`](../../../../packages/mcp-core/README.md)
