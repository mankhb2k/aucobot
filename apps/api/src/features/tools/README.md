# `features/tools/` — Tool Agent gọi khi **đang chat**

> **💡 Planned** — Chưa implement. Tool-calling gắn vào lượt hội thoại (Room/Session), không phải chạy Bot nền.

## Đảm nhiệm gì

Đây là **cầu nối Nest** giữa Agent đang nói chuyện với user và các **tool** LLM được phép gọi trong turn đó.

```text
User chat → Agent (LLM) → tool call → features/tools (wire + gate)
                                      → mcp-core / builtin / channels / integrations
```

| Việc thuộc folder này | Ví dụ |
|-----------------------|--------|
| Đăng ký tool vào agent theo skill group | Mai Content thấy `create_draft_post`, không thấy tool CS |
| Bind `ai-orchestration` + `mcp-core` | Attach `tools` vào `streamText` / `generateText` |
| Gate side-effect nguy hiểm | Tool “đăng bài” → **enqueue duyệt**, không publish thẳng |
| Builtin thuần app | `handoff_to_agent`, `create_draft_post`, `propose_automation` (cổng lắp Bot) |

## Không đảm nhiệm

| Việc | Để ở đâu |
|------|----------|
| Định nghĩa schema tool tái dùng (Zod + execute wrapper) | [`packages/mcp-core`](../../../../packages/mcp-core/README.md) |
| OAuth / HTTP Facebook–TikTok | [`features/channels`](../channels/README.md) |
| API key platform (Tavily…) | [`features/integrations`](../integrations/README.md) |
| Chạy Bot nhiều bước nền, BullMQ, WorkflowRun | [`features/workflow`](../workflow/README.md) |
| Catalog Block Lego (`cron`, `llm-transform`) | [`packages/blocks`](../../../../packages/blocks/README.md) |
| Gọi LLM thuần (không tool) | [`features/ai-orchestration`](../ai-orchestration/README.md) |

**Một câu phân biệt:** `tools/` = *Agent đang chat bấm nút làm việc một phát*; `workflow/` = *Bot đã dựng chạy lịch/nền nhiều bước*.

## Cấu trúc dự kiến

```text
features/tools/
  README.md                 # (file này)
  tools.module.ts           # Nest feature — ENABLED_FEATURES=tools (hoặc tách builtin)
  builtin/                  # Tool không phụ thuộc OAuth ngoài
    README.md
  # Tool “mỏng” khác có thể proxy sang channels/integrations
```

## Builtin (`builtin/`)

Tool **nội bộ Aucobot** — không cần token Facebook/Tavily:

| Tool (gợi ý) | Việc |
|--------------|------|
| `create_draft_post` | Tạo bản nháp chờ duyệt |
| `handoff_to_agent` | Chuyển hội thoại / nhờ agent khác |
| `propose_automation` | Cổng vào lắp Bot (discovery Block nằm trong quy trình compile, không phải chat tool lẻ) |

Chi tiết: [`builtin/README.md`](./builtin/README.md).

## Bật feature

Dự kiến qua `ENABLED_FEATURES` + registry (`core/features`). Agent nào thấy tool nào = `enabledSkillGroups` trên Agent (xem `core/agents`).

## Tham chiếu

- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — MCP tools, Agent vs Bot
- [`workflow-plan.md`](../../../../workflow-plan.md) mục 10 — `propose_automation` vs `list_blocks`
- [`packages/mcp-core/README.md`](../../../../packages/mcp-core/README.md)
