# `components/`

UI **dumb** — nhận props hoặc đọc store qua hook ở `app/` / `ClientXxxPage`.

## Subfolders

| Folder | Vai trò |
|--------|---------|
| [`app/`](./app/README.md) | UI app chat — TelegramAppShell, ChatList, ChatComposer, … |
| [`ui/`](./ui/README.md) | Design system — Button, Input, Spinner |
| [`auth/`](./auth/) | Email OTP login/register flow |
| [`marketing/`](./marketing/) | Landing page sections |

## Quy ước

- Mỗi component = folder `Name/Name.tsx` + `Name.module.css`.
- Named export. Storybook `.stories.tsx` cạnh component (`ui/`, `layout/`, `chat/`).
- **Cấm** gọi `lib/api`, `lib/stream` — parent/hook lo data.
