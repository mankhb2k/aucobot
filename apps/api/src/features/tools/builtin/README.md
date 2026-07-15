# Builtin tools

> **💡 Planned** — Tool thuần app, không phụ thuộc OAuth / API key bên ngoài.

Plugin / nhóm dự kiến: `builtin` (skill group trên Agent).

## Đảm nhiệm

Các tool **luôn thuộc sản phẩm Aucobot** — Agent gọi khi chat để thao tác nội bộ (draft, handoff, đề xuất automation).

| Tool | Việc | Ghi chú |
|------|------|---------|
| `create_draft_post` | Tạo bản nháp nội dung | Thường kèm approval trước khi publish |
| `handoff_to_agent` | Chuyển / nhờ agent khác trong Room | Không chạy Bot |
| `propose_automation` | User muốn “tự động hoá…” → kick compile Bot | Discovery Block nằm **trong** tool này, không expose `list_blocks` ra mọi chat |

`update_agent_memory` tách riêng ở [`../update-agent-memory/README.md`](../update-agent-memory/README.md) — cùng nhóm builtin (không OAuth/API key ngoài), chỉ tách folder cho dễ đọc.

## Không làm

- Gọi Facebook/TikTok → `features/channels`
- Web search Tavily → [`../web-search/`](../web-search/README.md)
- Đọc tài liệu → [`../read-document/`](../read-document/README.md)
- Định nghĩa Block / chạy WorkflowRun → `packages/blocks` + `features/workflow`

Wire Nest + gate: cha [`../README.md`](../README.md).
