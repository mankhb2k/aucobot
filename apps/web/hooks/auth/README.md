# `hooks/auth/`

## `use-auth-guard.ts`

Client-only auth check cho `app/app` (SPA — §0.1 `.agent/rule.md`). Gọi `authApi.getMe()` lúc mount:

| Kết quả | Hành động |
|---------|-----------|
| `checking` | `ClientAppShell` render shell rỗng (tránh flash nội dung) |
| `authenticated` | Trả `user`, `ClientAppShell` render bình thường |
| `unauthenticated` | `window.location.assign(marketingUrl("/login"))` |

Bổ sung cho edge guard trong `proxy.ts` (chỉ check cookie tồn tại, không gọi API) — hook này xác thực **token còn hợp lệ** (không hết hạn/bị revoke).

## `use-email-otp-flow.ts`

Pipe giữa `lib/api/auth` và `stores/auth-flow`. Nhận store từ `createAuthFlowStore(mode)`.

| Method | REST | Store |
|--------|------|-------|
| `submitEmail(email)` | `sendEmailCode(email, mode)` | `setEmail`, `setStep('code')`, resend cooldown |
| `verifyCode(code)` | `verifyEmailCode(email, code, mode)` | redirect `/` on success |
| `resendCode()` | `resendEmailCode(email, mode)` | reset cooldown |

Lỗi `409` / `401` theo route đã bỏ — verify thống nhất.
