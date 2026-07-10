# Nguyên tắc Phát triển Frontend — AucoBot Web

> Áp dụng cho `aucobot/apps/web/`. Mọi code (kể cả AI) phải tuân thủ.  
> Monorepo: đọc thêm `aucobot/aucobot-architecture.md` khi task chạm nhiều app/package.  
> **Sơ đồ folder:** `STRUCTURE.md` (mỗi folder có `README.md` kế hoạch).  
> **Config thực thi:** `eslint.config.mjs` · `tsconfig.json`

---

## 0. Frontend mỏng (đã chốt)

**Next.js + Zustand chỉ stream & hiển thị.** Mọi quyết định nghiệp vụ (agent, approval, job, OAuth token, LLM) ở **`apps/api`**.

```text
apps/api  ──REST + WebSocket──►  lib/http + lib/stream + lib/api
                                        │
                                        ▼
                              hooks/<domain>  (pipe — không logic)
                                        │
                                        ▼
                              stores/<domain>  (buffer stream + projection)
                                        │
                                        ▼
                              components/ + app/  (Telegram-style UI)
```

| Được trên web | Cấm trên web |
|---------------|--------------|
| Parse Zod response/event | State machine job, approval rules |
| Buffer stream chunk → text | Gọi LLM / MCP tools |
| UI state (scroll, panel, theme) | Tính quyền từ client state |
| Gửi intent user (`POST approve`) | Orchestrate agent handoff |

**Giao thức (đã chốt):** REST (lệnh) + WebSocket (push). Không GraphQL.  
**UX định hướng:** Telegram-style — list thread (phòng marketing) \| chat full-bleed. Không dashboard AI SaaS.

### 0.1 Rendering: `app/app` luôn SPA (client) · `app/site` SSR (đã chốt)

| Route | Render | Vì sao |
|-------|--------|--------|
| `app/app/**` — chat shell, `app.aucobot.com` | **Client-only.** `page.tsx` **không** `cookies()`/`headers()`/fetch động phía server — route giữ static, Next có thể prerender/cache | Sau login, không cần SEO/SSR. `cookies()` ép route dynamic + fetch server-to-server trước byte đầu = round-trip thừa, mất khả năng cache CDN |
| `app/site/**` — landing, login/register, `aucobot.com` | **SSR/SSG** (Next mặc định) — metadata, OG tags, sitemap | Cần SEO — key quảng cáo "Xây dựng Phòng Marketing Ảo" phải index được |

**Cấm trong `app/app/**`:**

- `page.tsx`/`layout.tsx` gọi `cookies()`, `headers()`, hoặc fetch server để lấy user/data hiển thị initial.
- Server Component fetch snapshot `initial*` (ngoại lệ so với §3.B.2 — chỉ áp dụng `app/site/**`).

**Auth guard 2 lớp cho `app/app`** (không chặn = SSR, không phải "chỉ ẩn UI" — vẫn đúng §1.1):

1. **Edge (`proxy.ts`)** — chỉ check **có cookie hay không** (đọc `request.cookies`, không gọi API) → thiếu cookie → `redirect` sang `/login` ngay, chưa render gì.
2. **Client (`hooks/auth/use-auth-guard.ts`)** — `ClientAppShell` gọi `authApi.getMe()` xác thực token còn hợp lệ (chưa hết hạn/bị revoke) → không hợp lệ → `window.location.assign(marketingUrl("/login"))`.

Áp dụng tương tự nếu thêm route mới dưới `app/app/**` sau này (vd `app/app/settings`) — **không** quay lại pattern RSC auth check.

---

## Mục lục

| § | Nội dung |
|---|----------|
| 0 | Frontend mỏng (0.1 Rendering SPA vs SSR) |
| 1 | Bảo mật |
| 2 | Tái sử dụng code |
| 3 | Cấu trúc thư mục |
| 4 | Data & state |
| 5 | UI & CSS |
| 6 | Phạm vi task |
| 7 | Kiểm thử |
| 8 | CI/CD & đóng gói |
| 9 | ESLint & enforcement |

---

## 1. Bảo mật

> Checklist chung — không gắn implementation cụ thể.

### 1.1 Xác thực & phiên

- Token/session do **server** quản lý (`httpOnly` cookie hoặc flow chuẩn framework).
- **Cấm** lưu access/refresh token trong `localStorage` / `sessionStorage`.
- Một nơi xử l API, refresh, redirect hết phiên — không duplicate auth.
- Route protected: guard **proxy** (edge), không chỉ ẩn UI.

### 1.2 Phân quyền

- Ẩn nút UI **không** thay check quyền backend.
- Không tin `role` / `userId` từ client state nếu chưa đối chiếu server.
- URL params (`/resource/:id`) phải **validate** trước API.

### 1.3 Validate dữ liệu

- **Input:** form, query, upload — validate schema trước submit.
- **Output API:** parse/validate response — không tin JSON tùy ý.
- TypeScript: `unknown` + parse; **cấm `any`**; **cấm `@ts-ignore`**.

### 1.4 XSS & render nội dung

- Mặc định render text (React escape).
- Cẩn trọng: `dangerouslySetInnerHTML`, Markdown/HTML, paste, URL `javascript:`.
- Chỉ HTML **đã sanitize**; ưu tiên `ReactMarkdown` + `rehype-sanitize`.
- Link ngoài `target="_blank"`: `rel="noopener noreferrer"`.
- Link nội app trong Markdown: `next/link` — xem `ChatMarkdown`.

### 1.5 Secrets

- **Cấm** API key/password/token trong `NEXT_PUBLIC_*`, source client, `console`, message lỗi user.
- Hiển thị key: **masked**; copy có confirm khi cần.
- **Cấm** secrets trong URL query.

### 1.6 Giao tiếp API

- HTTPS production; cookie auth: `Secure`, `SameSite`, `httpOnly`.
- Một HTTP client chuẩn — không rải `fetch`/`axios` thô.
- Timeout & lỗi thống nhất — không leak stack ra UI.

### 1.7 Lưu trữ client

| Được | Cấm |
|------|-----|
| Theme, locale, UI preference | Token, password, API key, PII thừa |

### 1.8–1.11 Upload, OAuth, WebSocket, dependency

- Upload: validate type/size/MIME; cẩn thận preview SVG/HTML.
- OAuth: validate redirect; state/nonce do backend.
- WebSocket: `WSS /api/ws/departments/:departmentId`; auth cookie lúc Upgrade — không secret trên query; event envelope Zod (`@aucobot/shared`).
- Dependency: không thêm package tùy tiện; không copy snippet có `eval`.

### 1.12 Logging & error UX

- Production: **cấm `console.*`** (enforce ESLint §9).
- Lỗi user: message chung; chi tiết kỹ thuật chỉ server/dev log.

---

## 2. Tái sử dụng code

> **Discover → Reuse → Extend → Create.**

### 2.1 Phân tầng folder

| Folder | Vai trò | Được | Cấm |
|--------|---------|------|-----|
| `app/` | Route + shell | RSC `initial*`, compose `ClientXxxPage` | Business logic, stream |
| `components/ui/` | Design system dumb | Button, Input, Spinner | API, store, stream |
| `components/layout/` | Shell Telegram | AppShell, SplitPane, Composer | Fetch |
| `components/chat/` | UI chat tái dùng | MessageList, Bubble, StreamText | Logic nghiệp vụ |
| `hooks/<domain>/` | Pipe mỏng | `lib/api`, `lib/stream`, stores, utils | JSX, business rules |
| `stores/<domain>/` | Zustand buffer | Stream chunks, projection server | `lib/api`, `lib/stream` |
| `lib/http/` | HTTP transport | `client`, `api-base-url`, `server-api` | Domain business, JSX |
| `lib/api/` | REST mirror + Zod | `xxxApi.list()` | React, stores, `server-api` |
| `lib/stream/` | WebSocket client | `agent-stream-client` | React, `lib/api` |
| `utils/<domain>/` | Format hiển thị | merge chunks, format time | React, fetch, API |
| `schemas/` | Zod | Re-export `@aucobot/shared` | Component, fetch |

**Luồng phụ thuộc:**

```text
components/app  →  stores  ←  hooks/<domain>  ←  lib/api + lib/stream + utils
components      →  stores (selector) — không gọi lib/api trực tiếp
hooks           →  lib/api | lib/stream | stores | utils
stores          →  utils (optional) — không lib/api
lib/api         →  lib/http, schemas|@aucobot/shared
lib/stream      →  lib/http (auth), @aucobot/shared
```

- `utils` không import `hooks`, `lib/api`, `lib/stream`.
- **Cấm** `fetch`/`axios` thô trong `app/`, `components/`, `hooks/`, `utils/` — qua `lib/api` hoặc `lib/stream` (§9).
- **Cấm** `components/` → `lib/api` | `lib/stream` — qua hooks.

**Code mới:** bắt buộc `hooks/<domain>/`, `utils/<domain>/`, `stores/<domain>/` khi có data domain.

### 2.2 Workflow trước khi viết mới

1. Search codebase — feature, API, component tương tự.
2. Kiểm tra `utils/`, `hooks/`, `lib/api/`.
3. Đọc `.stories.tsx` trong `components/ui/`.
4. Extend trước khi tạo file mới.
5. Đặt file đúng folder §2.1.

### 2.3 Extend vs tạo mới

| Tình huống | Hành động |
|------------|-----------|
| Thiếu prop UI | Thêm `components/ui/` |
| Endpoint cùng resource | Thêm method `lib/api/xxx.ts` |
| Logic thuần tái dùng | `utils/<domain>/` |
| State React tái dùng | `hooks/<domain>/` |
| Type form + API | `schemas/xxx.schema.ts` |
| UI 1 màn | `app/.../_components/` |

### 2.4 Anti-pattern

- `fetch`/`axios` trong component → `lib/api/*`
- Button custom → `Button` từ `components/ui`
- Copy hook → import `hooks/<domain>/`
- Helper thuần trong `hooks/` hoặc hook trong `utils/`

### 2.5 UI primitives

- Kiểm tra `components/ui/` **trước**.
- Đọc `.stories.tsx` trước khi dùng component UI.
- Composition first — không viết lại CSS primitive đã có.
- Mở rộng qua `variant`/`size`/props — không override style primitive từ component cha.

### 2.6 Storybook

- `.stories.tsx` **cạnh component** (`ui/`, `layout/`, `chat/`).
- Self-contained demo; `tags: ['autodocs']`.

---

## 3. Cấu trúc thư mục

### 3.A Sơ đồ `apps/web/`

> Bản đầy đủ + trạng thái implement: **`STRUCTURE.md`** · mỗi folder có **`README.md`**.

```text
apps/web/
├── STRUCTURE.md         Sơ đồ tổng + luồng data
├── app/                 Route + shell (§3.B)
│   ├── (auth)/          login, register
│   ├── site/            # aucobot.com — landing + auth
│   └── app/             # app.aucobot.com — chat
├── components/          ui/, layout/, chat/
├── hooks/<domain>/      pipe → lib + stores
├── stores/<domain>/     Zustand stream buffer
├── lib/
│   ├── http/            transport
│   ├── api/             REST mirror + Zod
│   └── stream/          WebSocket
├── utils/<domain>/      format hiển thị
├── schemas/             wrap @aucobot/shared
├── public/
├── scripts/
├── proxy.ts             host rewrite + auth guard edge (cookie presence, §0.1)
└── next.config.ts
```

### 3.B `app/`

#### 3.B.1 Cây route

```text
app/
├── layout.tsx, globals.css
├── site/page.tsx                 # aucobot.com landing
├── site/(auth)/login|register/   # auth trên domain chính
├── app/
│   ├── page.tsx                  # RSC → ClientAppShell
│   └── _components/ClientAppShell/
```

#### 3.B.2 `page.tsx` vs `ClientXxxPage`

| | `page.tsx` (Server) | `ClientXxxPage` |
|---|---------------------|-----------------|
| Layout shell | ✅ | ❌ |
| `initial*` snapshot qua `server-api` | ✅ | Nhận props |
| Mount stream hooks, đọc Zustand | ❌ | ✅ |
| Business logic | ❌ | ❌ |

- **`(auth)/`:** ngoại lệ — không bắt buộc `ClientXxxPage`.
- **`app/app/page.tsx`:** ngoại lệ khác — SPA client-only (§0.1), **không** `initial*` snapshot qua `server-api`, **không** `cookies()`/redirect server.
- **Chat** `app.aucobot.com/#departmentId` — một route `/`, hash chọn phòng (Telegram Web A).
- Auth: `site/(auth)/login`, `site/(auth)/register` trên domain marketing.

#### 3.B.3 `_components/`

- **Cấm** file component lẻ — mỗi component = folder `Name/Name.tsx`.
- Tiền tố: `ClientXxxPage`, `CardXxx`, `ModalXxx`, `XxxSection`, `NoXxx`.

### 3.C `components/`

| Subfolder | Vai trò |
|-----------|---------|
| `ui/` | Design system dumb |
| `layout/` | AppShell, SplitPane, Composer |
| `chat/` | MessageList, Bubble, StreamText, ApprovalInline |

Feature-specific 1 màn → `app/.../_components/`. **Không** `components/dashboard/`.

### 3.D `hooks/`

- Pipe: `lib/api` + `lib/stream` → `stores` — **không** business rules.
- Tên file **kebab** `use-xxx.ts`.
- Domain: `chat/`, `thread/`, `approval/`, …

### 3.E `utils/`

- Thuần: format, merge chunks — không React, không I/O.
- Import: `@/utils/<domain>/<file>`.

### 3.F `lib/`

| Path | Vai trò |
|------|---------|
| `lib/http/client.ts` | HTTP client duy nhất (+ cookie refresh) |
| `lib/http/server-api.ts` | RSC fetch + cookie forward |
| `lib/http/api-base-url.ts` | Base URL client/server |
| `lib/api/*` | REST mirror API — Zod parse only |
| `lib/stream/*` | WebSocket — không qua `lib/api` |

- `lib/api` **cấm** import `server-api`, React, stores.
- `server-api` chỉ từ RSC / `proxy.ts`.
- Session refresh: `lib/http/` — không `lib/auth/` business.

### 3.G `schemas/` · 3.H `stores/` · 3.I–3.L

- **schemas:** ưu tiên `@aucobot/shared`; local chỉ khi chưa có trên shared.
- **stores:** `stores/<domain>/`; **chỉ** buffer stream + projection; selector bắt buộc (§4.4); **cấm** `lib/api`.
- **public:** static only — cấm secrets.
- **scripts/:** không import vào app/components/lib/hooks/utils.

### 3.M Đặt tên & export

| Loại | Quy ước |
|------|---------|
| Component `.tsx` | PascalCase folder + file |
| CSS module component | `ComponentName.module.css` |
| CSS page/route | `<feature>.module.css` |
| Hook, util, store, schema | **kebab** `use-xxx.ts`, `xxx.schema.ts` |
| Story | `ComponentName.stories.tsx` |
| Export component/hook/util | **Named export** |
| `page.tsx`, `layout.tsx` | Default export (Next bắt buộc) |

Hook page-local: co-located trong `_components/ClientXxxPage/use-xxx.ts` — chỉ 1 màn.

---

## 4. Data & state

### 4.1 Ba kênh data

| Kênh | Layer | Khi nào |
|------|-------|---------|
| REST client | `lib/http/client` → `lib/api/*` | Gửi tin, approve |
| REST server | `lib/http/server-api` | RSC `initialThreads` / `initialMessages` |
| WebSocket | `lib/stream/*` | Stream agent reply, job/approval events (`message.chunk`, `job.status`, …) |

**Sau snapshot RSC:** client stream tiếp qua `lib/stream` + hooks — không hybrid `typeof window`.

### 4.2 `lib/api/` chuẩn

- Mirror `apps/api` REST — **một file / resource domain**.
- Mọi method: HTTP + **Zod parse** — không `if` nghiệp vụ.
- Export `xxxApi = { list, create, … }`.
- Thêm file khi API có endpoint — không scaffold logic trước.

### 4.3 Server vs client

- RSC → props `initial*`; không stream trên server component.
- Client: hooks pipe stream → stores → components.
- User action: component → hook → `lib/api` → API quyết định → event/stream → store.

### 4.4 State (Zustand = buffer stream)

| Lớp | Công nghệ | Lưu gì |
|-----|-----------|--------|
| Stream buffer | `stores/<domain>/` | Messages, chunks, connection status |
| Projection | `stores/<domain>/` | Thread list copy từ API, selected id |
| Page UI only | `useState` trong `ClientXxxPage` | Draft composer, modal open |
| Pipe | `hooks/<domain>/` | Subscribe stream, gọi API |
| Infra | Context (toast) | Không business data |

```ts
const messages = useMessageStore((s) => s.messagesByDepartmentId[id]); // selector bắt buộc
```

**Store actions chỉ projection:** `appendStreamChunk`, `setMessages`, `setConnectionStatus`.  
**Cấm** store action kiểu `approveAndSchedule()` có logic — hook gọi `approvalsApi.approve()`.

### 4.5 Form

- Form nhập liệu: **react-hook-form** + `zodResolver` + `schemas/` | `@aucobot/shared`.
- Submit → `lib/api` — API validate & xử lý.

### 4.6 Loading & 4.7 Error

- Loading list/page: `Spinner` hoặc skeleton pattern feature.
- Validation: inline `.field__error`; API action: `Toast` hoặc inline card — **một pattern / feature**.
- **Cấm** `alert()` cho lỗi thường.

### 4.8 Ảnh (Next.js)

- Dùng `import Image from "next/image"` + `unoptimized={shouldUseUnoptimized(src)}` (`utils/image/app-image.utils`).
- Icon có fallback: `IconProvider`.
- **Ngoại lệ `<img>`:** favicon domain bất kỳ — `eslint-disable` có lý do (vd `ToolResearchBlock`).

### 4.9 Link (Next.js)

- Navigation nội app: `next/link` — không `<a href="/...">` thuần.
- Markdown chat: link `/…` → `Link`; external → `<a target="_blank" rel="noopener noreferrer">`.

---

## 5. UI & CSS

### 5.1 Import

- Gộp import `@/components/ui`, `@/components/layout` trên một dòng.

### 5.2 CSS Modules

- **Không** Tailwind / Bootstrap / MUI / shadcn.
- Mỗi component: `.module.css` cạnh file; class phẳng (không BEM).
- Comment CSS tiếng Việt ngắn mô tả block.
- Dùng **CSS variables** từ `globals.css` — không hardcode màu/spacing (trừ 1–7px §5.3).
- **Không** `className` + `style` cùng lúc trên một element.

### 5.3 Tokens

- Font: `xs` → `2xl`; spacing `--space-*` (4px bước); radius `--radius-md` (control), `--radius-lg` (card/modal).
- Card hover: border + shadow — không `translateY`; không `transition: all`.

### 5.4 TypeScript component

- Cấm `any`; props có type rõ; cấm `@ts-ignore`.

---

## 6. Phạm vi task

### 6.1 Nguyên tắc

- Một task → một phạm vi; **diff tối thiểu**.
- Extend trước khi tạo mới (§2.2).
- **`aucobot/apps` storage = local** (avatar PG, chat disk) — không phụ thuộc `RUNTIME_MODE` (API: `apps/api/.agent/rule.md` §1.13).
- **Giữ `NEXT_PUBLIC_RUNTIME_MODE`:** `oss` (mặc định self-host) ẩn UI cloud (spawn container, `SetupCloudRecreate`, subdomain URL); `cloud` bật UI đó — dùng khi build/deploy product `../cloud/`.

### 6.2 Trong phạm vi

`aucobot/apps/web/` — `app/`, `components/`, `hooks/`, `utils/`, `lib/`, `schemas/`, `stores/`, `public/`.

### 6.3 Cấm (trừ user yêu cầu rõ)

| Cấm | Lý do |
|-----|--------|
| Sửa `apps/api`, `packages/*`, `deploy/` | Ngoài web scope |
| Thêm dependency | Review + security |
| Drive-by refactor / format cả file | Khó review |
| Tạo markdown/doc mới | Chỉ khi user yêu cầu |
| Commit/push git | Chỉ khi user yêu cầu |
| Refactor legacy toàn codebase | Chỉ file đang chạm |

### 6.4 Template task (AI)

```text
Task: [một câu]
Scope: aucobot/apps/web/[path]
Out of scope: apps/api, packages/, unrelated refactor
Verify: §8
Rule: .agent/rule.md §[liên quan]
```

---

## 7. Kiểm thử

### 7.1 Phạm vi

- **Unit/helper:** `node:test` + `node:assert` trong `**/*.spec.ts` cạnh source (vd `utils/chat/*.spec.ts`).
- **Chạy:** từ `aucobot/`:

```bash
pnpm --filter @aucobot/web test
```

- Test spec **chạy typed lint** (cùng chuẩn Promise §9) — chỉ nới ranh giới tầng §9.4.
- **`node:test`:** `void describe(…, async () => { await it(…) })` khi `describe`/`it` async.

### 7.2 Storybook

- Dev: `pnpm --filter @aucobot/web storybook` (port 6006).
- Build static: `pnpm --filter @aucobot/web build-storybook`.
- Story **không** deploy production — nới ESLint §9.4.

### 7.3 E2E / Playwright

- Script trong `scripts/` khi có — không import vào app.

---

## 8. CI/CD & đóng gói

### 8.1 Pipeline (`/.github/workflows/web-ci.yml`)

Trigger: PR/push `main` khi đổi `apps/web/**`, `packages/**`, lockfile.

| Bước | Lệnh | Yêu cầu |
|------|------|---------|
| Install | `pnpm install --frozen-lockfile` | — |
| Lint | `pnpm --filter @aucobot/web lint` | **0 error** |
| Typecheck | `pnpm --filter @aucobot/web typecheck` | **0 error** |
| Build | `pnpm turbo run build --filter=@aucobot/web` | Thành công |

Node 22 · pnpm 9 (field `packageManager`).

### 8.2 Verify local (trước khi xong task)

Từ `aucobot/`:

```bash
pnpm --filter @aucobot/web lint
pnpm --filter @aucobot/web typecheck
pnpm --filter @aucobot/web build
```

Task chạm workspace package → build package đó trước (`AGENTS.md`).

### 8.3 Dev & production

| Lệnh | Mục đích |
|------|----------|
| `pnpm --filter @aucobot/web dev` | Dev server port **8386** |
| `pnpm --filter @aucobot/web build` | `next build` production |
| `pnpm --filter @aucobot/web start` | Serve build port 8386 |

### 8.4 Đóng gói

- Output: `.next/` (gitignore).
- `transpilePackages`: workspace deps (`@aucobot/workspace-sync`, …).
- API proxy: `next.config.ts` rewrites `/api/*` → backend.
- Images: SVG allowlist trong `next.config.ts` — dùng với `next/image` §4.8.

### 8.5 TypeScript strictness (`tsconfig.json`)

| Flag | Bắt buộc | Ý nghĩa |
|------|----------|---------|
| `strict` | `true` | Bộ kiểm tra khắt khe nhất (null-check, implicit any…) |
| `noImplicitReturns` | `true` | Mọi nhánh `if/else`/`switch` phải return nhất quán |
| `noUnusedLocals` | `true` | Cấm biến/import rác (bổ trợ ESLint) — typecheck **fail** nếu còn |

- **`noUnusedLocals` ⇒ cấm `import React` thừa**: JSX dùng transform `react-jsx`, không cần `import React`. Chỉ import khi thực sự dùng `React.<API>` (vd `React.ReactNode`).
  - `import React, { useX } from "react"` → `import { useX } from "react"`.
  - `import React from "react"` đứng một mình → xoá cả dòng.
- Biến cố ý không dùng (exhaustiveness `never`): vẫn phải **tham chiếu** giá trị (vd nhét vào message lỗi) — `noUnusedLocals` **không** bỏ qua tiền tố `_`.
- Field/biến chỉ ghi mà không đọc = code chết → xoá.

---

## 9. ESLint & enforcement

> Config thực thi: `eslint.config.mjs`. Baseline: **0 error / 0 warn**.

### 9.1 Hai mức

| Mức | CI | Ý nghĩa |
|-----|-----|---------|
| **`error`** | Chặn merge | Luật cam kết giữ sạch |
| **`warn`** | Không chặn | Nợ kỹ thuật — code mới không thêm |

**Ratchet:** luật mới thường `warn` → `error` khi snapshot sạch.

### 9.2 Base preset

`eslint-config-next/core-web-vitals` + `typescript` + Storybook flat recommended.

Nâng cấp riêng: `@next/next/no-img-element: error`.  
Giữ `warn`: `@next/next/no-typos` (Pages Router; App Router ít tác dụng).

### 9.3 Luật `error` — kiến trúc AucoBot

| Luật / nhóm | Nội dung |
|-------------|----------|
| `@typescript-eslint/no-explicit-any` | Cấm `any` |
| `@typescript-eslint/ban-ts-comment` | Cấm `@ts-ignore`; `@ts-expect-error` có mô tả |
| `no-restricted-globals: fetch` | UI/hooks/utils — qua `lib/api` |
| `no-restricted-imports: axios` | UI/hooks/utils — qua `lib/api` |
| Ranh giới `utils/**` | Cấm React, API, hooks, UI (cho `import type`) |
| Ranh giới `lib/api/**` | Cấm React, hooks, UI, `server-api` |
| Ranh giới `hooks/**` | Cấm UI/app; cấm fetch/axios thô |
| `no-restricted-syntax` | Named export — trừ `page`/`layout`/stories |
| `react/no-unescaped-entities` | Chỉ cấm `>` / `}` trong JSX text |

### 9.4 Luật `error` — logic & an toàn (ESLint core)

| Luật | Nội dung |
|------|----------|
| `eqeqeq` | `===` / `!==`; cho phép `== null` |
| `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url` | Cấm eval / script URL |
| `no-throw-literal` | Chỉ `throw new Error(...)` |
| `array-callback-return`, `no-promise-executor-return` | Callback/executor đúng return |
| `no-return-assign`, `no-self-assign`, `no-unreachable-loop` | Logic bug |
| `no-unsafe-optional-chaining` | Không arithmetic trên optional chain |
| `no-console` | Cấm `console.*` prod |
| `no-param-reassign` | Không mutate param (`props: true`; whitelist `acc`/`draft`/…) |
| `consistent-return` | Nhánh return nhất quán |
| `default-case` | `switch` có `default` hoặc exhaustiveness `never` |
| `prefer-template` | Template literal thay `+` nối chuỗi |


### 9.5 Luật `error` — import

| Luật | Mức | Nội dung |
|------|------|----------|
| `import/no-duplicates`, `no-self-import`, `no-useless-path-segments` | error | Vệ sinh import |
| `import/first`, `import/newline-after-import` | error | Thứ tự file |
| `import/order` | **warn** | Nhóm + `@/**` internal + alphabetize + `type` last |

### 9.6 Luật — React

| Luật | Mức | Nội dung |
|------|------|----------|
| `react/no-array-index-key` | warn | Stable key khi list động |
| `react/jsx-no-useless-fragment` | error | Bỏ Fragment 1 con |
| `react/no-unstable-nested-components` | error | Component ở module scope |
| `react/no-danger` | warn | Cảnh báo `dangerouslySetInnerHTML` |
| `react-hooks/rules-of-hooks` | **error** | Hook chỉ gọi ở top-level component/hook viết hoa — Storybook `render` tách thành component |
| `react-hooks/set-state-in-effect` | **error** | Không `setState` đồng bộ trong `useEffect` — derive render / fetchKey / callback async |
| `react-hooks/exhaustive-deps` | **error** | Khai báo đủ dep thật; `useMemo`/`useCallback` cho giá trị/hàm dùng làm dep; `eslint-disable` có lý do (§9.11) khi thêm dep gây re-run ngoài ý muốn |
| `react-hooks/refs` | **error** | Không đọc/ghi `ref.current` lúc render — gán trong `useEffect`, đọc trong handler/async |
| `react-hooks/preserve-manual-memoization` | warn | Bỏ manual memo thừa để React Compiler giữ được (compiler đang tắt runtime) |
| `react-hooks/static-components` | warn | Không tạo component động lúc render — đưa ra module scope (vd `PlatformIcon`) |
| `react-hooks/incompatible-library` | warn | API thư viện không memo được (RHF `watch()`) — `eslint-disable` §9.11 nếu chủ đích |
| `react-web-api/no-leaked-timeout` | **error** | `setTimeout` trong `useEffect` phải gán `const timerId = …` và `return () => clearTimeout(timerId)` — nhiều timer: tách component con (vd `DoneActivityScheduler`) |
| `react-web-api/no-leaked-interval` | **error** | `setInterval` trong effect phải `clearInterval` ở cleanup tương ứng |

**Chính sách `key`:** `id` → composite → nội dung → index (chỉ list tĩnh + disable có lý do).

**Chính sách `setState` trong effect:** tính tại render (`useMemo`/const); reset loading khi `projectId` đổi (render-time `trackedFetchKey`); loader gọi từ effect bọc `await Promise.resolve()` trước khi `setState`.

### 9.7 Luật `error` — Promise (typed lint)

| Luật | Nội dung |
|------|----------|
| `@typescript-eslint/no-floating-promises` | `await` / `.catch` / `void` có chủ đích |
| `@typescript-eslint/no-misused-promises` | Không async trong `.map`/timer sync; JSX `attributes: false` |

Cần `projectService: true` — bỏ qua stories/scripts/mocks (§9.4 nới).

### 9.8 Luật — Next.js

| Luật | Mức | Nội dung |
|------|------|----------|
| `@next/next/no-img-element` | error | Dùng `next/image` §4.8 |
| `@next/next/no-html-link-for-pages` | error | Dùng `next/link` §4.9 |
| `@next/next/no-typos` | warn | Typo `getStaticProps`… (Pages Router) |

### 9.9 Luật `warn` — React Compiler hints

`react-hooks/preserve-manual-memoization`, `react-hooks/static-components`, `react-hooks/incompatible-library`, `storybook/no-renderer-packages`. Hiện **0 vi phạm**.

- Code **mới** không thêm warn — fix ngay hoặc `eslint-disable` có lý do (§9.11).

### 9.10 Nới luật (§7.3 trong config)

**Artifact** (`*.stories.tsx`, `scripts/**`, `lib/api/mocks/**`, …): tắt `no-explicit-any`, `no-restricted-*`, `no-console`, `no-param-reassign`, Promise rules, `react/no-array-index-key`, …

**Test** (`*.spec.ts`, `*.test.*`): chỉ nới ranh giới tầng + `import/first` — **giữ** logic & Promise typed lint.

### 9.11 `eslint-disable`

- Chỉ khi bắt buộc — kèm `-- lý do` + tham chiếu §.
- **Cấm** disable cho code mới thay vì sửa đúng chuẩn.

### 9.12 Tham khảo Airbnb (chỉ đọc)

- **Không** `extends('airbnb')` — cherry-pick từng luật vào `eslint.config.mjs`.
- Clone tham khảo: `scratch/airbnb-javascript/`.

---

*Cập nhật quy định: sửa `rule.md` + `eslint.config.mjs` đồng bộ.*
