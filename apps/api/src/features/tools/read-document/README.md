# `read-document` (feature id: `documents`)

Cloudflare R2 upload + `read_document` tool. Ops switch: `ENABLED_FEATURES=...,documents`.

## Components

| File | Role |
|------|------|
| `r2.storage.ts` | S3Client Put/Get |
| `documents.service.ts` | Upload pipeline + extract + list |
| `documents.controller.ts` | `POST/GET /api/conversations/:id/documents` |
| `read-document-tool.service.ts` | Registers `read_document` on PluginRegistry |

Env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, optional `R2_PUBLIC_BASE_URL`.
