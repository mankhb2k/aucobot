# `block-core` — Luật chơi của Block

> **💡 Scaffold** — Chưa có code. Contract + registry cho hệ Block/Bot (xem [`workflow-plan.md`](../../workflow-plan.md) mục 5 + Sprint 1).

## Vai trò

**Định nghĩa Block là gì** — không chứa Block cụ thể (`cron`, `llm-transform`, …).

Giống “hộp luật Lego”: kích thước khớp, cách nối, kiểu lỗi — để mọi bên (API, worker, BotArchitect) nói cùng một ngôn ngữ.

| Có trong package này | Không có ở đây |
|----------------------|----------------|
| `BlockDefinition` (id, group, schema, `agentHint`, chữ ký `execute`) | Implementation `trigger.cron`, `process.llm-transform`, … |
| Registry: đăng ký / lấy / list bản nhẹ | UI card trên canvas (ở `apps/web`) |
| Lỗi chuẩn (`BlockUserError`, …) | OAuth / gọi Facebook (ở `features/channels`) |
| Guardrail nhẹ lúc chạy (parse Zod N→N+1) | Queue job Bot (ở `features/workflow`) |

## Vì sao tách khỏi `blocks/`

- Package khác chỉ cần **luật + registry**, không buộc kéo cả 15–20 Block.
- Thêm Block mới = sửa `packages/blocks`, không đụng API ổn định của core.
- Execution plane sau này (worker / WDK) import `block-core` dễ hơn Nest `features/`.

## Dự kiến cấu trúc (khi implement)

```text
packages/block-core/
  src/
    block.interface.ts    # BlockDefinition, BlockGroup, context
    registry.ts           # register / get / list_blocks metadata
    errors.ts             # User / Operational / Unexpected
    index.ts
  README.md
```

## Ai phụ thuộc package này

```text
packages/blocks          → implement BlockDefinition
apps/api (workflow)      → đăng ký catalog + chạy Bot
BotArchitect / tools     → list_blocks / describe_blocks (discovery)
```

## Liên quan

| Chỗ | Việc |
|-----|------|
| [`packages/blocks`](../blocks/README.md) | Các Block thật (catalog vetted) |
| [`workflow-plan.md`](../../workflow-plan.md) | Interface + catalog + discovery 2 lớp |
| `apps/web/components/app/Block/` | Chỉ **vẽ** diagram — không phải runtime Block |
