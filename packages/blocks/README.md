# `blocks` — Catalog Block (các viên Lego)

> **💡 Scaffold** — Chưa có code. Implementation vetted của từng Block (xem [`workflow-plan.md`](../../workflow-plan.md) mục 7 + Sprint 2).

## Vai trò

**Các Block cụ thể** Aucobot ship sẵn — mỗi Block = 1 việc, đã qua review, Agent chỉ được **ghép** chứ không tự invent type mới.

Giống “túi viên Lego”: `cron`, `llm-transform`, `notification`, … Mỗi viên:

- `inputSchema` / `outputSchema` (Zod)
- `agentHint` (whenToUse / whenNotToUse / few-shot) — quan trọng để Agent chọn đúng
- `execute(ctx)` — chạy thật lúc Bot runtime
- metadata hiển thị diagram (`displayName`, `icon`, `shortSummary`)

## Vì sao không nhét luật vào đây

Luật chung (`BlockDefinition`, registry, lỗi) nằm ở [`block-core`](../block-core/README.md).

`blocks` **chỉ** thêm viên mới. Ai import catalog nặng chỉ khi cần chạy / discover full; chỗ chỉ cần contract thì dùng `block-core`.

## Dự kiến cấu trúc (khi implement)

```text
packages/blocks/
  src/
    trigger/
      cron/
      agent-invoked/
    process/
      llm-transform/
      data-mapper/
    action/
      notification/
    index.ts              # registerAllBlocks(registry)
  README.md
```

Theo group trong plan: `trigger` | `extraction` | `processing` | `action`.

## MVP gợi ý (Sprint 2)

| Block id | Group | Ghi chú |
|----------|-------|---------|
| `trigger.cron` | trigger | Lịch chạy |
| `process.llm-transform` | processing | Sinh/tóm tắt — `agentHint` đầu tư kỹ |
| `action.notification` | action | Báo user (chưa cần OAuth thật) |

## Không để ở đây

| Thứ | Để ở |
|-----|------|
| Interface / registry | `packages/block-core` |
| Queue, WorkflowRun, duyệt | `apps/api/src/features/workflow/` |
| OAuth Facebook/TikTok | `apps/api/src/features/channels/` |
| Card UI trên canvas | `apps/web/components/app/Block/` |

## Liên quan

| Chỗ | Việc |
|-----|------|
| [`packages/block-core`](../block-core/README.md) | Luật + registry |
| [`workflow-plan.md`](../../workflow-plan.md) | Catalog đầy đủ + nguyên tắc generic-first |
| `list_blocks` / `describe_blocks` | Discovery 2 lớp lúc lắp Bot (mục 10 plan) |
