# `database/` — PostgreSQL (Prisma)

> **✅ Implemented** — Single source of truth cho schema và `@prisma/client`.

## Vai trò

- Định nghĩa **models**, **migrations**, **enum** PostgreSQL
- Export `PrismaClient` + types cho `apps/api` (`PrismaService`) và scripts

**Không** chứa business logic NestJS — wrapper nằm ở `apps/api/src/core/database/`.

## Cấu trúc

| Path | Vai trò |
|------|---------|
| `prisma/schema.prisma` | Schema — **chỉ sửa ở đây** |
| `prisma/migrations/` | Migration history |
| `src/index.ts` | Singleton `prisma` (dev hot-reload) + re-export `@prisma/client` |

## Models hiện có (✅)

| Model | Ghi chú |
|-------|---------|
| `User` | Auth — email, Google, timezone |
| `RefreshToken` | JWT session rotation |
| `EmailOtpChallenge` | OTP login/register |
| `Conversation` | Room + Session (`ConversationType`) |

## Models planned (💡)

`Message`, `Agent`, `ConversationMember`, `Bot`, … — xem [`agent-plan.md`](../../agent-plan.md) và [`aucobot-architecture.md`](../../aucobot-architecture.md).

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `pnpm --filter @aucobot/database db:generate` | `prisma generate` |
| `pnpm --filter @aucobot/database db:migrate` | `prisma migrate dev` |
| `pnpm --filter @aucobot/database db:push` | `prisma db push` (dev nhanh) |
| `pnpm --filter @aucobot/database db:studio` | Prisma Studio |

Hoặc từ root: `pnpm db:migrate`, `pnpm db:studio`.

## Env

| Env | Ghi chú |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection string — đọc lúc migrate và runtime |

## Quy tắc

| Được | Cấm |
|------|-----|
| Thêm model + migration qua `db:migrate` | `db push` lên production |
| Export types từ `@aucobot/database` | Raw SQL rải khắp app (trừ health ping) |
| Index theo query pattern (`userId`, `updatedAt`) | Breaking rename cột không migration |

## Consumer

- `apps/api` — `PrismaService` inject trong services
- `packages/database` — standalone scripts (migrate, studio)
