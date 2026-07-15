# `lib/api/`

Mirror **`apps/api` REST** — mỗi file = 1 resource domain.

## Files

| File | API endpoints | Trạng thái |
|------|---------------|------------|
| `auth.ts` | `/api/auth/*` | ✅ |
| `conversations.ts` | `/api/conversations` | ✅ |
| `agents.ts` | `/api/conversations/:id/agents` | 🔜 |
| `messages.ts` | `/api/conversations/:id/messages` | ✅ |
| `approvals.ts` | `/api/approvals/*` | 🔜 |
| `scheduled-posts.ts` | `/api/scheduled-posts` | 🔜 |
| `documents.ts` | upload/list docs | ✅ |


## Pattern

```ts
export const conversationsApi = {
  list: async () => schema.parse(await http.get(...)),
  create: async (body) => ...,
  getById: async (id) => ...,
};
```

Chỉ Zod parse + HTTP. **Không** `if` nghiệp vụ.
