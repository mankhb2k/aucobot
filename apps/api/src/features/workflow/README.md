# `features/workflow/` — Control plane chạy **Bot / job nền**

> **💡 Planned** — Chưa implement. Hàng đợi, chạy automation, duyệt kết quả — **không** phải catalog Block, **không** phải tool chat từng turn.

## Đảm nhiệm gì

Nest giữ **control plane**: lưu artifact Bot, enqueue việc nặng, theo dõi run, đẩy kết quả cần duyệt. Phần chạy JS AI-gen / multi-step lâu nằm **execution plane** riêng (worker / WDK) — không `eval` trong process API.

```text
Agent (hoặc cron / event)
  → enqueue job / kích hoạt BotVersion đã duyệt
  → features/workflow (BullMQ + trạng thái run)
  → worker/executor chạy từng Block (packages/blocks + block-core)
  → bước side-effect (đăng bài…) → Approval queue → user duyệt
```

| Việc thuộc folder này | Ví dụ |
|-----------------------|--------|
| Queue / worker hook (BullMQ, …) | Job publish, job chạy Bot, retry |
| Trạng thái run | `WorkflowRun` / `WorkflowStep`, pause khi fail liên tiếp |
| Approval **nội dung** đầu ra | Hàng chờ duyệt trước khi đăng thật |
| Orchestrate control plane | Auth đã có ở core; đây bind job ↔ ownerId / conversation |
| WebSocket job status | Emit `job.status`, `approval.updated` (realtime) |

## Không đảm nhiệm

| Việc | Để ở đâu |
|------|----------|
| Luật Block + registry | [`packages/block-core`](../../../../packages/block-core/README.md) |
| Implementation từng Block (`cron`, `llm-transform`) | [`packages/blocks`](../../../../packages/blocks/README.md) |
| Tool LLM gọi **trong chat** | [`features/tools`](../tools/README.md) |
| OAuth social | [`features/channels`](../channels/README.md) |
| Gọi LLM chat Session/Room | [`features/ai-orchestration`](../ai-orchestration/README.md) |
| Card vẽ diagram trên web | `apps/web/components/app/Block/` |

**Một câu phân biệt:** `workflow/` = *Bot/job đã (hoặc sẽ) chạy nền*; `tools/` = *Agent trả lời user và gọi tool trong cuộc chat*.

## Quan hệ với Block catalog

```text
packages/block-core     luật chơi
packages/blocks         viên Lego (execute)
features/workflow       xếp lịch / chạy / duyệt kết quả lắp ráp
```

Agent **lắp** Bot (compile) thường vào qua tool `propose_automation` (`features/tools`) → artifact `BotVersion` → **bật chạy** / cron nằm ở `workflow/`.

## Việc nền dự kiến (MVP → sau)

| Job / luồng | MVP? |
|-------------|------|
| Publish bài đã duyệt lên channel | Gần MVP publish |
| Approval queue nội dung | Cùng publish |
| Chạy BotVersion (cron / agent-invoked) | Theo [`workflow-plan.md`](../../../../workflow-plan.md) |
| Self-healing / re-generate glue | Sau |

## Cấu trúc dự kiến

```text
features/workflow/
  README.md
  workflow.module.ts
  queues/                 # định nghĩa queue + processor bridge
  bots/                   # 💡 CRUD Bot / BotVersion (hoặc core khi ổn định)
  approvals/              # hàng chờ duyệt kết quả
```

Tên thư mục con **chưa chốt code** — chỉ hướng phân tách.

## Bật feature

`ENABLED_FEATURES` inkl. `workflow` (hoặc tách `publishing` / `approvals` nếu cần fine-grain). Cần Redis khi dùng BullMQ.

## Tham chiếu

- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — Bot Workflow, control vs execution plane
- [`workflow-plan.md`](../../../../workflow-plan.md) — Block/Bot, approval flag trên Action
- [`features/tools/README.md`](../tools/README.md) — tool chat vs job nền
