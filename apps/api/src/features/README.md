# Features

Thư mục plugin theo domain — **chưa implement code**, chỉ giữ layout đã thống nhất.

| Thư mục | Vai trò (một câu) |
|---------|-------------------|
| [`tools/`](./tools/README.md) | Mọi tool Agent gọi **khi đang chat** — `builtin/`, `update-agent-memory/`, `web-search/`, `read-document/` |
| [`channels/`](./channels/README.md) | Social **OAuth của user** (`facebook`, `tiktok`) + MCP social — feature nặng, tách riêng khỏi `tools/` |
| [`workflow/`](./workflow/README.md) | **Control plane** Bot/job nền (queue, run, approval kết quả) |
| [`ai-orchestration/`](./ai-orchestration/README.md) | Runtime LLM (generate/stream) — không định nghĩa Agent |

**Không nhầm:** catalog Block Lego = [`packages/blocks`](../../../../packages/blocks/README.md) + [`block-core`](../../../../packages/block-core/README.md).  
**Plugin id** trong `ENABLED_FEATURES` = tên feature cụ thể (`web-search`, `documents`, `facebook`), không phải tên folder cha (`tools`, `channels`) — mỗi subfolder trong `tools/` tự bật/tắt độc lập.

**MVP hiện tại:** core auth/health + ai-orchestration (messages). Thêm plugin khi được yêu cầu — đăng ký qua `ENABLED_FEATURES` / `core/features`.

Xem `aucobot-architecture.md`.
