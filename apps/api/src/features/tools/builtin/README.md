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

## Không làm

- Gọi Facebook/TikTok → `features/channels`
- Web search Tavily → `features/integrations`
- Định nghĩa Block / chạy WorkflowRun → `packages/blocks` + `features/workflow`

Wire Nest + gate: cha [`../README.md`](../README.md).
