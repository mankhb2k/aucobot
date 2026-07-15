# `features/tools/` — Mọi tool Agent gọi khi **đang chat** (trừ social OAuth)

> **💡 Planned** — Chưa implement. **Không** phải nơi "wire" hay "attach" tool cho agent — xem §Single registration path ở [`core/plugins/README.md`](../../core/plugins/README.md) trước khi đọc file này.

## Đảm nhiệm gì

`tools/` gom **mọi tool LLM gọi trong lượt chat**, mỗi tool 1 subfolder riêng — bất kể tool có cần platform API key (`web-search`) hay không (`builtin`, `read-document`, `update-agent-memory`). Mỗi subfolder tự implement `FeaturePlugin` riêng, tự đăng ký `mcpTools` của nó vào `core/plugins` registry — **không có subfolder nào đăng ký hộ subfolder khác**.

**Vì sao gộp chung một folder cha** (thay vì tách `integrations/` theo kiểu secret như `channels/`): số lượng tool loại "platform key, không OAuth" hiện chỉ có 1-2 cái — tách tầng nhóm riêng lúc này là premature, gây rối cho người đọc hơn là giúp ích. `channels/` (facebook, tiktok) vẫn tách riêng vì đó là feature nặng thật: OAuth flow, webhook, nhiều endpoint — không phải "tool nhỏ gọi 1 phát".

```text
User chat → Agent (LLM) → tool call
  → executor đọc tool từ core/plugins registry (mỗi subfolder tự đăng ký lúc onEnable)
  → chạy execute trong đúng subfolder (builtin/ | web-search/ | read-document/ | update-agent-memory/)
  → tool có side-effect nguy hiểm → bọc qua Approval-gate helper (dùng lại được ở mọi feature, kể cả channels/)
```

## Các con (scaffold)

| Subfolder | Feature id (`ENABLED_FEATURES`) | Secret cần | Tool |
|-----------|----------------------------------|------------|------|
| [`builtin/`](./builtin/README.md) | *(luôn bật cùng `tools`)* | Không — chỉ Prisma | `create_draft_post`, `handoff_to_agent`, `propose_automation` |
| [`update-agent-memory/`](./update-agent-memory/README.md) | *(luôn bật cùng `tools`)* | Không — chỉ Prisma | `update_agent_memory` |
| [`web-search/`](./web-search/README.md) | `web-search` | `TAVILY_API_KEY` (platform) | `web_search` |
| [`read-document/`](./read-document/README.md) | `documents` | Storage R2/S3 (platform) | `read_document` |

`web-search` và `documents` **giữ id riêng** trong `ENABLED_FEATURES` — ops tắt được từng cái độc lập (vd. thiếu `TAVILY_API_KEY`) mà không ảnh hưởng tool khác. Đây là switch **của platform/ops**, khác với việc **user** bật/tắt tool cho từng agent qua `Agent.enabledSkillGroups` (`POST/PATCH /api/agents`) — hai tầng độc lập nhau.

## Không đảm nhiệm

| Việc | Để ở đâu |
|------|----------|
| Đăng ký tool vào registry / lọc theo skill group | `core/plugins` (registry) + `core/agents` (`enabledSkillGroups`) — mỗi subfolder tự đăng ký `mcpTools` của mình |
| Attach `tools` vào `streamText` / `generateText` | [`features/ai-orchestration`](../ai-orchestration/README.md) — đọc registry trực tiếp, không qua `features/tools` |
| Định nghĩa schema tool tái dùng (Zod + execute wrapper) | [`packages/mcp-core`](../../../../packages/mcp-core/README.md) |
| OAuth / HTTP Facebook–TikTok | [`features/channels`](../channels/README.md) — feature nặng, không gộp vào `tools/` |
| Chạy Bot nhiều bước nền, BullMQ, WorkflowRun | [`features/workflow`](../workflow/README.md) |
| Catalog Block Lego (`cron`, `llm-transform`) | [`packages/blocks`](../../../../packages/blocks/README.md) |
| Gọi LLM thuần (không tool) | [`features/ai-orchestration`](../ai-orchestration/README.md) |

**Một câu phân biệt:** `tools/` = *Agent đang chat bấm nút làm việc một phát, kể cả tool cần platform key*; `channels/` = *OAuth + webhook nặng, không phải tool nhỏ*; `workflow/` = *Bot đã dựng chạy lịch/nền nhiều bước*.

## Cấu trúc dự kiến

```text
features/tools/
  README.md                    # (file này)
  tools.module.ts               # implement FeaturePlugin cho builtin + update-agent-memory
  builtin/
    README.md
    builtin-tools.service.ts    # execute create_draft_post / handoff_to_agent / propose_automation
  update-agent-memory/
    README.md
    update-agent-memory.service.ts
  web-search/
    README.md
    web-search.module.ts        # feature id: web-search
    web-search.service.ts       # gọi Tavily bằng TAVILY_API_KEY
  read-document/
    README.md
    read-document.module.ts     # feature id: documents
    read-document.service.ts    # đọc R2/S3 + extract text
  approval/                     # 💡 helper requireApproval() dùng lại ở mọi feature khác
```

## Bật feature

- **Ops (env):** `builtin/` + `update-agent-memory/` luôn bật cùng `tools`; `web-search/` cần `ENABLED_FEATURES` có `web-search` + `TAVILY_API_KEY`; `read-document/` cần có `documents` + storage config.
- **User (UI/API):** agent nào thấy tool nào = `Agent.enabledSkillGroups` (xem `core/agents`), lọc trên registry của `core/plugins` — **không** qua `features/tools`.

## Tham chiếu

- [`core/plugins/README.md`](../../core/plugins/README.md) — single registration path
- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — MCP tools, Agent vs Bot
- [`workflow-plan.md`](../../../../workflow-plan.md) mục 10 — `propose_automation` vs `list_blocks`
- [`packages/mcp-core/README.md`](../../../../packages/mcp-core/README.md)
