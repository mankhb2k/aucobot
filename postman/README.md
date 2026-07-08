# Postman — Aucobot API

## Định dạng

| File | Chuẩn |
|------|--------|
| `aucobot-api.postman_collection.json` | **Postman Collection v2.1** |
| `aucobot-local.postman_environment.json` | **Postman Environment** |

Import được vào Postman desktop hoặc web (Import → file JSON).

## Import

1. Postman → **Import** → chọn cả 2 file trong folder này
2. Chọn environment **Aucobot Local** (góc phải trên)
3. Chạy API: `pnpm --filter @aucobot/api dev`
4. `.env`: `NODE_ENV=development`, `ENABLED_FEATURES=ai-orchestration`, `TOGETHER_API_KEY=...`

## Thứ tự test

```text
Health → Health Check
Auth → Dev Login          (lưu accessToken)
Conversations → Create Session   (lưu conversationId)
Messages → Send Message
Messages → List Messages
```

## Cookie

API dùng cookie `access_token` (httpOnly). Collection set header fallback:

`Cookie: access_token={{accessToken}}`

Sau **Dev Login**, script tự gán `accessToken` từ response JSON. Nếu 401, chạy lại Dev Login (token hết hạn ~15 phút).

## Biến

| Biến | Mô tả |
|------|--------|
| `baseUrl` | `http://localhost:8387/api` |
| `accessToken` | JWT từ dev-login |
| `conversationId` | ID session sau Create Session |

Có thể export lại collection/environment sau khi chỉnh để cập nhật repo.
