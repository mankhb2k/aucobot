# `shared/` — Types, Zod schemas, constants

> **✅ Implemented** — Contract dùng chung giữa `apps/api`, `apps/web`, và packages khác.

## Vai trò

**Single source of truth** cho:

- Zod schemas validate request/response API
- TypeScript types mirror JSON API
- Hằng số ports, enums dùng chung

Tránh duplicate schema giữa Nest DTO và Next.js form validation.

## Cấu trúc

| File | Export chính |
|------|----------------|
| `src/auth-otp.ts` | `sendEmailCodeSchema`, `verifyEmailCodeSchema`, OTP types |
| `src/conversations.ts` | `createConversationSchema`, `conversationResponseSchema`, … |
| `src/index.ts` | Re-export + `UserResponse`, `HealthResponse`, `DevLoginResponse`, ports |

## Modules hiện có

### Auth OTP

- `emailOtpPurposeSchema` — `login` \| `register`
- Input schemas cho send / verify / resend email code

### Conversations

- `conversationTypeSchema` — `room` \| `session`
- `createConversationSchema` — title, description?, type
- Response schemas cho list + detail

### Common types

- `UserResponse`, `AuthSessionMeta`, `AuthSuccessResponse`
- `HealthResponse`
- `DevLoginResponse` + cookie info (dev only)
- `API_DEFAULT_PORT` (8387), `WEB_DEFAULT_PORT` (8386)

## Planned (💡)

`agents.ts`, message schemas, WebSocket event envelopes — thêm file mới, export từ `index.ts`.

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| Schema API mới → thêm Zod ở đây trước | `@nestjs/swagger` class-validator song song unrelated schema |
| `createZodDto()` ở api import từ `@aucobot/shared` | Business logic |
| `import type` khi chỉ cần types | Import Nest/Next vào package này |

## Consumer

| App | Cách dùng |
|-----|-----------|
| `apps/api` | DTO (`nestjs-zod`), response typing |
| `apps/web` | Form validation, `userResponseSchema.parse` |
| `packages/llm-services` | 💡 structured output schemas sau |

## Build

```bash
pnpm --filter @aucobot/shared build
```

Apps phụ thuộc `workspace:*` — Turbo build `^build` trước khi typecheck api/web.
