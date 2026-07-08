# `packages/` — Thư viện dùng chung monorepo

> Workspace packages — import qua `@aucobot/*`. Build trước app: `pnpm build` (Turbo `^build`).

## Packages

| Package | Trạng thái | Vai trò |
|---------|------------|---------|
| [`database/`](./database/README.md) | ✅ | Prisma schema + PostgreSQL client |
| [`shared/`](./shared/README.md) | ✅ | Zod schemas, types, constants (api ↔ web) |
| [`llm-services/`](./llm-services/README.md) | ✅ scaffold | Together AI qua Vercel AI SDK |
| [`social-providers/`](./social-providers/README.md) | 💡 | Facebook / TikTok API abstraction |
| [`mcp-core/`](./mcp-core/README.md) | 💡 | MCP tools bọc social + platform |

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| Logic **framework-agnostic** (không Nest, không Next) | Import `apps/api` hay `apps/web` |
| Types/schemas dùng chung → **`shared`** | Duplicate Zod giữa api và web |
| DB schema **chỉ** trong `database/prisma` | Prisma schema trong `apps/api` |
| Provider LLM → **`llm-services`** | Gọi Together trực tiếp rải khắp API |

## Scripts (repo root)

```bash
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate dev
pnpm db:studio      # Prisma Studio
```

Chi tiết kiến trúc: [`aucobot-architecture.md`](../aucobot-architecture.md).
