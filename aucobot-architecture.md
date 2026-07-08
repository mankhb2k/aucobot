# Aucobot — Architecture

> Tài liệu mô tả **ý tưởng giải pháp**, **key quảng cáo**, **MVP features**, **cấu trúc monorepo** và **kiến trúc kỹ thuật**.

### Ký hiệu trạng thái

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **✅ Đã làm** | Đã implement trong repo — mô tả là **kiến trúc hiện tại** |
| **🔜 Phase 1** | Đang / sắp làm trong sprint chat MVP (Room + Session) |
| **💡 Ý tưởng** | Tương lai — chưa code, chỉ thiết kế / contract dự kiến |

> **Thuật ngữ:** Tên cũ **`Department`** (phòng marketing ảo) được thay bằng **`Room` (Phòng)** trong UI chat kiểu Telegram. Marketing copy vẫn dùng *“phòng marketing ảo”* — cùng concept, tên kỹ thuật gọn hơn.

---

## Giải pháp

**Aucobot** là nền tảng **AI Agent Cloud** kết nối trực tiếp các nền tảng marketing & bán hàng (Facebook, TikTok, …) qua OAuth và API chính thức.

User ra yêu cầu bằng ngôn ngữ tự nhiên → hệ thống **tự động giao việc cho AI** trong **phòng marketing ảo** riêng: đọc tài liệu, viết content, lên lịch, đăng bài, báo kết quả — không chỉ trả lời chat.

Kiến trúc **multi-agent**: user **xây dựng phòng marketing ảo khép kín** — nhiều AI agent, mỗi agent một vai (viết bài, lên lịch, đăng bài…), giao tiếp và phối hợp qua MCP tools (Facebook, TikTok).

---

## Thông điệp quảng cáo (đã chốt)

### Key cốt lõi: **「Xây dựng Phòng Marketing Ảo Của Riêng Bạn」**

Mọi thông điệp quảng cáo, landing page, social media và nội dung truyền thông **chỉ xoay quanh key này**.

| Mục | Nội dung |
|-----|----------|
| **Key chính** | Xây dựng Phòng Marketing Ảo Của Riêng Bạn |
| **Key rút gọn (ads)** | Phòng marketing ảo |
| **Định vị một câu** | Aucobot — xây dựng phòng marketing ảo của riêng bạn, với các trợ lý AI kết nối Facebook & TikTok |
| **Promise** | Tạo phòng ban marketing khép kín: nhiều agent phối hợp viết bài, hẹn giờ và đăng tự động |
| **Khác biệt so với chatbot** | Không một chatbot đơn lẻ — một **phòng marketing** thật sự làm việc thay bạn |

**Quy tắc copy:**

- Headline / hero / ads: luôn gợi **phòng marketing ảo** / **xây dựng phòng marketing của riêng bạn**
- Feature mô tả qua lăng kính phòng ban: *“Trợ lý viết bài trong phòng của bạn”*, *“Cả phòng phối hợp đăng đúng giờ”*
- CTA gợi ý: *“Dựng phòng marketing ảo miễn phí”*, *“Bắt đầu xây phòng marketing”*
- Tránh làm key phụ cạnh tranh: “AI Agent Cloud”, “multi-agent”, “SaaS rẻ” — chỉ dùng nội bộ / tài liệu kỹ thuật

**Ví dụ biến thể (cùng một key):**

| Kênh | Ví dụ |
|------|--------|
| Landing H1 | Xây dựng Phòng Marketing Ảo Của Riêng Bạn |
| Facebook Ads | Bận kinh doanh? Dựng phòng marketing ảo — AI lo Facebook & TikTok |
| SEO / meta | Aucobot \| Phòng marketing ảo — AI agent cho Facebook & TikTok |

---

## Chat Telegram-style với AI (đã chốt hướng sản phẩm)

**Aucobot** là app chat **giống Telegram** về UX — sidebar danh sách hội thoại, panel chat full-bleed, composer dưới cùng — nhưng user **trò chuyện với AI agent** thay vì con người.

| Telegram | Aucobot |
|----------|---------|
| Group / Channel | **Room (Phòng)** — nhiều agent trong một phòng làm việc chung |
| Chat 1-1 với bot / task | **Session (Phiên)** — việc nhanh / scratch; **agent hệ thống ship sẵn**, mở là chat (kiểu ChatGPT / Gemini) |
| Danh sách chat | Sidebar sort theo hoạt động gần nhất |
| Contact | **💡** Danh bạ agent preset (DM riêng — phase sau) |

### MVP Phase 1 — chỉ Room + Session

| Có trong Phase 1 | Chưa Phase 1 (💡) |
|------------------|-------------------|
| **Session + Quick Assistant** — tạo phiên → chat ngay, không setup agent | WebSocket stream agent |
| **Tạo Phiên** (goal ngắn) — auto gắn agent hệ thống | Brand kit, approval, đăng FB/TikTok |
| **Tạo Phòng** (tên bắt buộc + mô tả tùy chọn) | Thêm user-agent vào phòng (sau khi Mother đẻ) |
| Sidebar list Room + Session | DM agent từ danh bạ |
| Mở chat qua hash `#conversationId` | |
| Empty state → **Phiên chat mới** (zero ceremony) | |

**Không auto-tạo Room** khi đăng ký — giống Telegram: phòng marketing user **chủ động dựng**.

**Session khác Room:** platform **ship sẵn Quick Assistant** (agent hệ thống). User **không** chọn agent, **không** qua Mother, **không** tag — mở phiên là gõ tin (trải nghiệm giống ChatGPT / Gemini). Dùng cho việc nhanh, ngoài lề, không ảnh hưởng context các Room khác.

**User agent** (Mai, CS Bot, …) — user tạo qua **Mother**, chỉ dùng trong **Room**; không add vào Session.

### Tạo Phòng — UX giống Telegram “New Channel”

**💡 Ý tưởng UI** (tham chiếu Telegram Web):

```text
┌─ Tạo phòng mới ─────────────────┐
│  ← back                         │
│       [ avatar / icon ]         │  💡 optional sau
│  ┌─────────────────────────┐   │
│  │ Tên phòng *              │   │  ← bắt buộc (vd. "Team TikTok Q1")
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Mô tả (tùy chọn)         │   │
│  └─────────────────────────┘   │
│  Bạn có thể thêm mô tả cho     │
│  phòng.                         │
│                          [ → ] │  → tạo xong mở chat
└─────────────────────────────────┘
```

**🔜 API:** `POST /api/conversations` `{ type: "room", title, description? }` → auto member `@Trợ Lý` **💡**

### Tạo Phiên — UX ChatGPT / Gemini (zero setup)

User **không** chọn agent, **không** wizard — chỉ đặt tên goal (vd. "Soạn caption Tết") rồi chat.

```text
┌─ Phiên chat mới ────────────────┐
│  ← back                         │
│  ┌─────────────────────────┐   │
│  │ Tên phiên *              │   │  ← vd. "Brainstorm headline"
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Mô tả (tùy chọn)         │   │
│  └─────────────────────────┘   │
│                          [ → ] │  → mở chat với Quick Assistant
└─────────────────────────────────┘
```

**🔜 API:** `POST /api/conversations` `{ type: "session", title, description? }` → backend auto-bind **Quick Assistant** (system).

Empty state gợi ý **Phiên chat mới** trước **Tạo phòng** — đường vào nhanh nhất giống "New chat" ChatGPT.

### Room vs Session

| | **Room (Phòng)** | **Session (Phiên)** |
|---|------------------|---------------------|
| Mục đích | Không gian làm việc lâu dài (team, campaign, phòng marketing) | Việc nhanh / scratch / ngoài lề — không lẫn context Room |
| Mental model | Telegram **group** — nhiều agent, mention | **ChatGPT / Gemini** — mở là chat 1-1 |
| Tên | User đặt (bắt buộc) | User đặt / goal ngắn |
| Mô tả | Tùy chọn | Tùy chọn |
| Agent | **User agents** (Mother đẻ) + **`@Trợ Lý`** (system orchestrator) | **`Quick Assistant`** (system) — ship sẵn, **1 agent cố định** |
| Chọn agent lúc tạo? | Không bắt buộc — add sau từ danh bạ | **Không** — backend auto-bind Quick Assistant |
| Routing tin nhắn | **Mention-only** (không tag → không ai trả lời) | **Luôn trả lời** — không cần tag |
| Orchestrator | Có `@Trợ Lý` (auto-provision) | **Không** — thừa cho 1-1 |
| Icon sidebar | 👥 group | ⚡ task |

### System agents vs User agents (đã chốt hướng)

Hai tầng agent — **không gộp**:

| Tầng | `ownerId` | Ai tạo | Ví dụ | Dùng ở đâu |
|------|-----------|--------|-------|------------|
| **System** | `null` · `isSystem: true` | Platform seed / provision | **Quick Assistant**, **@Trợ Lý**, **Mother** | Session · Room · onboarding |
| **User** | `userId` | User qua Mother → `POST /api/agents` | Mai Content, CS Bot, … | **Room** — add từ danh bạ |

| System agent | `presetId` | Vai trò |
|--------------|------------|---------|
| **Quick Assistant** | `quick-assistant` | Gắn **mọi Session** — chat zero-setup, việc nhanh |
| **@Trợ Lý** | `orchestrator` | Auto **mọi Room** — dispatch user-agent theo mention |
| **Mother** | `mother` | Onboarding — **chỉ đẻ** user agent (BotFather-style) |

**Quy tắc enforce (planned):**

- `POST session` → auto `ConversationMember` Quick Assistant (`isDefault: true`, không remove)
- User **không** add user-agent vào Session (API reject)
- User agent **không** tự vào Session khi Mother tạo xong
- Mỗi Session = thread riêng — history/memory scope theo `conversationId`, không leak sang Room

Module: [`core/agents/`](apps/api/src/core/agents/README.md) — CRUD user agent, seed system agents, `AgentResolver`.

### Agent vs Bot — **💡 ý tưởng** (hai loại "người làm việc")

Trong mỗi **Room**, user có **Agent user** (linh hoạt, Mother đẻ) và **Bot** (workflow cố định). **Session** chỉ dùng **Quick Assistant** (system) — không mix user-agent vào phiên scratch.

| | **Agent** 🧠 | **Bot** ⚙️ |
|---|-------------|-----------|
| Bản chất | AI reasoning — hiểu ngôn ngữ, tự quyết, gọi tool linh hoạt | Workflow **cố định** cho một việc cụ thể — **không suy nghĩ** |
| Ai tạo | **User** (Mother wizard) hoặc **System** (Quick Assistant, @Trợ Lý, Mother) | **Agent lắp ráp** từ **Block** hệ thống (glue); thiếu Block → JS inline user kiểm soát |
| Cách chạy | LLM (Vercel AI SDK) + tool calling, kết quả không định trước | Thực thi **JavaScript đơn giản** — deterministic, input → output rõ ràng |
| Chi phí / tốc độ | Tốn token, chậm hơn, "đắt" | Rẻ, nhanh, chạy lặp lại ổn định |
| Ví dụ | "Viết 5 caption Tết theo brand kit rồi lên lịch" | "Mỗi 9h sáng lấy post nhiều like nhất tuần → gửi báo cáo" |
| Ẩn dụ | Nhân viên biết nghĩ | Macro / dây chuyền tự động |

Bot mới ở mức **ý tưởng**. Toàn bộ thiết kế "Agent xây Bot" được gom vào một khối mở rộng bên dưới để tránh nói lại nhiều lần.

##### Thuật ngữ chốt — Block vs Bot (tránh chồng nghĩa)

| Tên | Là gì | Ai tạo |
|-----|-------|--------|
| **Block** (khối Lego) | Đơn vị **1-việc dựng sẵn**: Cron, Scraper, LLM Transformer, Publisher… | **Hệ thống** — catalog cố định, đã vetted |
| **Bot** | Nhiều **Block** ghép lại + glue → chạy được | **Agent lắp ráp** khi user cần (không qua Mother) |

- **Mother chỉ đẻ Agent** (tuyển người). Bot **không** đi qua Mother — agent tự nhặt/ghép Block khi cần → **không có bước "xin bot"**.
- **Hai chế độ dùng Block/Bot:**
  - **A — chạy ngay, một lần** (agent đang làm việc nhặt Block chạy luôn): **zero ceremony**, như gọi tool.
  - **B — Automation đứng nền** (chạy lặp / theo lịch / sự kiện, không ai ngồi xem): user **luôn biết nó tồn tại** và có thể **bật · tắt · sửa · xóa** trong danh sách Automations. Không wizard nặng — chỉ hiển thị + điều khiển.
- **Thiếu Block phù hợp:** agent được phép **tự sinh JS inline** cho việc đó, nhưng **user vẫn kiểm soát** (thấy được, duyệt/tắt) + đánh dấu **tín hiệu roadmap** để platform bổ sung Block chính danh. Không để agent tự chế Block mới vào catalog vetted.
- **Side-effect ra ngoài** (đăng bài…) vẫn qua **Approval queue nội dung** — duyệt *kết quả*, không duyệt *bot*.

#### Bot Workflow — thiết kế mở rộng (💡 tham khảo khi scale)

> **Đây là ý tưởng tham khảo cho tương lai — KHÔNG phải MVP, không cam kết implement.** Ghi lại các quyết định thiết kế đã bàn để khi mở rộng "Agent xây Bot" thành nền tảng automation (nuôi traffic affiliate, cào–render–đăng video…) không phải nghĩ lại từ đầu. Tất cả bám các seam đã có: *Agent vs Bot*, `Bot`/`BotTemplate`, core+features plugin, thang 5 nấc tách DB, `ownerId` trên mọi bảng.

**Mô hình "compiler" — tách compile-time và runtime.** Đây là ý tưởng nền, mọi quyết định phía dưới suy ra từ đây: Agent làm việc ở *compile-time* (đắt, chậm, 1 lần); Bot chạy ở *runtime* (rẻ, nhanh, lặp vô hạn, **không gọi LLM**).

```text
compile-time (Agent):   User mô tả → chọn Bot Template → sinh glue JS điền template
                        → dry-run 1–2 record thật (không side-effect)
                        → user DUYỆT KẾT QUẢ (không duyệt code)
                        → lưu thành BotVersion bất biến
runtime (Bot):          Executor chạy BotVersion đã duyệt — deterministic, KHÔNG đụng LLM,
                        chạy độc lập trong sandbox cô lập
```

**Bot Template** — khung workflow soạn sẵn để **hướng dẫn Agent sinh code đúng**. Agent chỉ điền glue vào template, không tự chế khung:

| Thành phần | Vai trò |
|-----------|---------|
| `trigger` | Enum chính: `schedule` (cron) · `event` (webhook/DB event/listener) · `agent-invoked` (Agent gọi khi user tag giao việc) |
| `steps[]` | Chuỗi bước JS thuần; mỗi bước input/output có **Zod schema** do template định nghĩa |
| `tools` | Tool allowlist bot được phép gọi (dùng chung MCP registry với Agent) |
| `guardrails` | Giới hạn khai báo: thời gian chạy, số lần retry, không side-effect ngoài allowlist |

**1 — Artifact immutable + versioned:** Mỗi lần Agent sinh lại = một `BotVersion` **bất biến** mới (không sửa đè) → rollback được, chống hallucination. Bot đang chạy **pin version**; version mới chỉ active sau khi user duyệt kết quả — **không hot-swap** logic giữa chừng một run.

**2 — Hai trục quyết định độc lập: trigger (nơi chạy) và độ phức tạp (engine).** Trigger enum chính là `schedule | event | agent-invoked`.

*Trục 1 — Trigger → runtime profile → nơi chạy & chi phí* (không dựa vào số bước):

| Runtime profile | Suy ra từ trigger | Nơi chạy | Chi phí |
|-----------------|-------------------|----------|---------|
| **Ephemeral** | `schedule` · `agent-invoked` · `event` (webhook) | Spin-up theo lịch/sự kiện, xong tắt | Tính theo số lần chạy |
| **Long-lived** | `event` dạng listener / polling (DB event, social monitor canh liên tục) | Execution plane 24/7 riêng | Compute thường trực → gắn "gói 24/7" bán cho user |

> Số bước nhiều **không** đồng nghĩa cần 24/7 — workflow 10 bước chạy cron vẫn ephemeral.

*Trục 2 — Độ phức tạp → chọn engine:*

| | Job đơn / tuyến tính ngắn | Multi-step + human-in-loop / chờ lâu / cần checkpoint |
|---|---|---|
| **Engine** | **A — BullMQ** (đã có; tự quản state qua `WorkflowRun`/`WorkflowStep`) | **B — WDK** (durable; tự checkpoint / resume-after-crash / pause chờ duyệt) |
| **Ví dụ** | Publish 1 bài lúc 9h (MVP) | Scrape → LLM → render → duyệt → đăng (Bot Workflow 💡) |

- **WDK cắm ở tầng code JS** (Next / Express / Hono / Nitro — **không first-class NestJS**) → code workflow B nằm **phía Vercel hoặc JS service riêng**, không nhét vào NestJS. NestJS giữ vai **control plane** (lưu artifact, enqueue, auth); WDK là **execution plane** cho multi-step.
- Hai trục **độc lập**: một bot có thể *ephemeral + BullMQ* (cron publish đơn) hoặc *ephemeral + WDK* (cron nhiều bước có bước chờ duyệt).

**3 — Sandbox / execution plane cô lập:** NestJS = **control plane** (auth, lưu artifact, enqueue, duyệt) — **không bao giờ** tự chạy JS AI-gen (`eval` bị cấm trong process API). Thực thi đẩy sang execution plane riêng:

- **Hybrid:** ephemeral → **Vercel Sandbox** (microVM per-run, xong huỷ); long-lived → **worker container riêng** (persistent).
- **Guardrail cứng ở tầng executor** (KHÔNG nằm trong JS AI-gen): no-network trừ tool trong allowlist (MCP registry) · timeout + memory cap + CPU cap · không truy cập secret/env platform · không import module tuỳ ý.
- **Nhất quán với nguyên tắc MVP:** việc tách execution plane là hệ quả của [Khi nào tách worker khỏi API](#khi-nào-tách-worker-khỏi-api) (Phase 2/3); sandbox **per-run** vẫn là *scale-theo-job*, không phải *container/user* — không vi phạm nguyên tắc "Không container/user".

**4 — Contract giữa các khối Lego (ép ở runtime):** output node N phải `.parse()` Zod thành công mới vào node N+1; fail schema = fail job ngay, không cho data rác lan bước sau. Schema do **Bot Template định nghĩa** (không phải Agent) → Agent chỉ sinh glue map dữ liệu, thu hẹp không gian sai. *(Bước dry-run + duyệt kết quả xem ở sơ đồ compiler bên trên.)*

**5 — Phân tầng bot theo rủi ro pháp lý & nền tảng:**

| Tầng | Loại bot | Rủi ro chính | Chiến lược phòng vệ |
|------|----------|--------------|---------------------|
| **Chính danh** | OAuth official (FB Graph, TikTok API) | Chết chùm App ID | Hard-code rate limit + content filter trong template; dùng chung hạ tầng được |
| **Vùng xám** | scrape / reverse API / render lại | DMCA · ban IP · pháp lý VN | **Cô lập hạ tầng/IP** khỏi tầng chính danh; ép **BYOP + BYO credentials**; ToS safe-harbor riêng |

- Guardrail (content filter + rate limit) đặt **trong executor/template cứng**, chạy **trước node publish** — không đặt trong JS AI-gen (tránh Agent/user gỡ bỏ).
- ToS "safe harbor": platform chỉ cung cấp công cụ, user chịu trách nhiệm nội dung/nguồn; quyền đơn phương khoá tài khoản khi vi phạm.

**6 — Lưu trữ dữ liệu (tách hot/cold, khớp thang 5 nấc):**

```text
[Scraper] → raw thô → State store riêng (Redis / schema riêng), TTL tự huỷ ~7 ngày
                         │
                  [Agent & glue] (lọc, xào, render)
                         │
[Sync] → thành phẩm sạch → Postgres chung (kèm ownerId + workflowId + runId)
Media (video/ảnh) → R2/S3 (lifecycle rule tự xoá); DB chỉ lưu URL
```

Model dữ liệu (💡) — cũng liệt kê ở [Schema DB](#schema-db--ý-tưởng-bổ-sung-prisma):

| Model | Vai trò |
|-------|---------|
| `Block` | Khối Lego **hệ thống** (vetted) — Cron, Scraper, LLM Transformer, Publisher… catalog cố định |
| `Bot` | Định danh automation (Block ghép + glue) + con trỏ version active + owner/tier; user **bật/tắt/sửa/xóa** |
| `BotTemplate` | Khung workflow hướng dẫn Agent nối Block + sinh glue (trigger/steps/tools/guardrails) |
| `BotVersion` | Artifact **bất biến**: graph Block + glue JS + I/O schema; rollback = đổi con trỏ |
| `WorkflowRun` | Mỗi lần chạy — trạng thái tổng |
| `WorkflowStep` | Output từng node — truyền N→N+1 + resume |

> State tạm/raw **không** để chung Postgres core (seam "vertical split theo domain" — nấc 3).

**7 — Workflow rot & self-healing:** Bot scrape/reverse-API hỏng theo thời gian khi nguồn đổi DOM/API (không phải lỗi code).

- **Health tracking:** metric `last_success` + đếm fail liên tiếp; fail N lần → **tự pause** + Notification Bot báo user.
- **Self-healing:** output lệch schema → Agent **re-generate glue** từ artifact cũ + sample data mới → `BotVersion` mới → dry-run + user duyệt → active.
- **Bán tự động:** hệ thống phát hiện + đề xuất; **user duyệt version mới** trước khi chạy (giữ human-in-the-loop, không full-auto).

**Thư viện Block định sẵn — 4 nhóm Lego (💡):** mỗi **Block** là một khối single-responsibility do **hệ thống** cung cấp (vetted); Agent đóng vai người lắp ráp, chỉ sinh glue nối đầu ra Block này vào đầu vào Block kia. Kết quả lắp ráp = một **Bot**.

| Nhóm | Block ví dụ | Vai trò |
|------|-------------|---------|
| **Trigger** | Cron/Schedule · Webhook Listener · Database Event | Khởi tạo luồng (hiện thực của trigger enum) — không nhận input từ Block khác |
| **Extraction** | API Fetcher · Web Scraper · Social Monitor | Thu thập dữ liệu thô |
| **Processing** | Data Mapper (glue) · LLM Transformer · Media Processor · Affiliate Link Generator | "Chế biến" — nơi Agent sinh glue nhiều nhất |
| **Action** | Social Publisher · Database Sync · Notification | Thực thi cuối ra thế giới ngoài |

Ví dụ lắp ráp một **Bot**: *"Mỗi sáng lấy video top 1 từ X, LLM viết lại caption gắn link affiliate, tự lên lịch đăng"* → `Cron → Web Scraper → Data Mapper (Agent sinh glue tách link/tiêu đề) → LLM Transformer → Affiliate Link Generator → Social Publisher`.

> **Thiếu Block:** nếu chuỗi cần một khối chưa có trong catalog, agent **sinh JS inline** cho bước đó (user kiểm soát được: xem/duyệt/tắt) + ghi **tín hiệu roadmap**. Không tự thêm Block vào catalog vetted.

### Luồng tương tác trong Room — ai trả lời? (💡 ý tưởng)

> 💡 tương lai (Room nhiều user / nhiều agent = Vòng 2). Giải bài toán "nhiều agent trong một phòng thì ai trả lời, ai làm việc gì, có bị nghẽn không". Sáu quyết định dưới đây đã chốt hướng (chưa code MVP).

**Nguyên tắc gốc — user chỉ tương tác với Agent:** User giao việc bằng cách **tag một Agent**; Agent reasoning rồi **gọi tool/Bot** để làm. **User không gọi Bot trực tiếp** — Bot/workflow chỉ là *công cụ* của Agent, không phải người tham gia chat.

```text
User → tag @agent → Agent reasoning → gọi tool để làm
                                     → stream "đã nhận → đang làm → đã xong" về Room
```

#### 1 — Topology: hình sao (star), KHÔNG mesh — agent không gọi agent

Mọi phối hợp đi qua **orchestrator `@Trợ Lý`**. Agent **không biết agent khác tồn tại**, **không** có `handoff_to_agent`. Việc tuần tự (B cần output của A) do orchestrator làm trung gian:

```text
User → @Trợ Lý "làm X cần A rồi B"
        ├─ gọi Agent A → thu kết quả
        ├─ đưa kết quả A cho Agent B → thu kết quả
        └─ tổng hợp → trả user
```

**Vì sao bỏ tầng trung gian (kiểu phó GĐ / trưởng phòng):** con người cần middle-manager vì **span of control** (1 người quản nổi ~7). Orchestrator AI **không có giới hạn đó** — đọc mô tả 20 agent + dispatch song song trong một lượt. Nên flat + 1 orchestrator là đúng; bê nguyên hierarchy của người vào AI là mô phỏng sai ràng buộc. Bỏ mesh cũng tránh **vòng lặp vô tận** + **token nổ** + **khó debug**.

#### 2 — Orchestrator là "cửa mặc định", KHÔNG phải "cửa duy nhất"

Ép mọi request qua orchestrator = gấp đôi độ trễ + token (orchestrator reasoning rồi mới tới agent thật) và biến orchestrator thành **nút thắt cổ chai**. Giữ nhiều đường vào:

| User làm | Hành vi |
|---|---|
| `@Trợ Lý làm X` | Orchestrator phân rã + dispatch (**mặc định**, khi lười / phó mặc) |
| `@Mai viết caption` | Gọi **thẳng** Mai, bỏ qua orchestrator (khi biết rõ ai) |
| Reply vào tin của agent | Tiếp tục ngữ cảnh với agent đó, khỏi tag lại |
| Không tag (Room) | **Không ai trả lời** — tránh nhiễu + tốn token |

- **Session (chat 1-1):** **không có orchestrator** — route luôn tới **Quick Assistant** (system). Mọi tin user gửi đều có reply — **không tag** (giống ChatGPT / Gemini).
- **Auto-provision:** mỗi **Room** tự có sẵn `@Trợ Lý`; mỗi **Session** tự có sẵn **Quick Assistant** — user không cấu hình agent lúc tạo phiên/phòng.

#### 3 — Định tuyến 2 lớp: LỌC cứng + CHỌN mềm

Orchestrator route dựa **capability manifest** của từng agent, không đoán mò:

| Tín hiệu | Dùng để | Kiểu |
|---|---|---|
| `skillGroups` | **LỌC cứng** — ai *làm được* (có tool cần thiết) | Máy đọc, chuẩn hóa |
| `role` (preset hoặc custom) | **Hiển thị** + gợi ý cho user | Người đọc |
| `description` (+ "không làm gì") | **CHỌN mềm** — ai *hợp nhất* | Orchestrator reasoning |

```text
Lớp 1 — LỌC (cứng): agent nào CÓ skillGroups cần thiết?      → chắc chắn, không đoán
Lớp 2 — CHỌN (mềm): trong nhóm lọc được, ai HỢP nhất?         → đọc role + description
        ≥2 agent ngang nhau → giao đại (round-robin)          → KHÔNG hỏi user
```

- **Không** route bằng *tên* role tự đặt (custom → "Content" vs "Copywriter" vs "Viết bài" sẽ loạn). Tên role để **user nhìn**; máy route bằng `skillGroups` + `description`.
- **"Làm được" ≠ "hợp nhất":** hai agent cùng có tool `facebook` (Publisher vs Analyst) — lọc cứng qua cả hai, chọn mềm bằng role/description để giao đúng người.
- **Negative scope** (`description` ghi rõ *KHÔNG làm gì*) giúp orchestrator loại nhanh, tránh route nhầm.
- **💡 tinh chỉnh sau (defer):** cho user đặt **"agent chính" cho mỗi skill** trong room (VD đăng FB → mặc định Publisher); orchestrator ưu tiên agent chính, fallback khi bận/lỗi.

#### 4 — Không ai làm được → gợi ý actionable (vòng giữ chân)

```text
0 agent hợp   → báo user + gợi ý:  [Tạo agent Analyst]  hoặc  [Bật kỹ năng Google Sheets cho Mai]
1 agent hợp   → giao luôn
≥2 agent hợp  → giao đại (round-robin), KHÔNG hỏi user
```

Mỗi lần "không làm được" → gợi ý tạo agent / bật skill → user xây phòng đầy đủ hơn (đúng tinh thần *"Xây dựng phòng marketing ảo của riêng bạn"*).

**Guardrail:** match phải dựa trên `skillGroups` **thật**, không đoán; ngưỡng tự tin thấp → **hỏi lại user** thay vì nhận bừa rồi route cho agent không đủ khả năng. Chỉ hỏi khi **không có ai hợp**, không hỏi khi **nhiều người hợp**.

#### 5 — preset vs role vs description (tránh 3 khái niệm đá nhau)

| Field | Vai trò | Bền vững? |
|---|---|---|
| `preset` | **Hạt giống** wizard — chọn xong tự điền sẵn role + tone + gợi ý skillGroups | Chỉ lúc tạo |
| `role` | **Chức danh** thật (routing display) — chọn từ list có sẵn **hoặc** tự đặt | Lưu bền |
| `description` | Chi tiết tự do (ai / làm gì / không làm gì) — có **khung gợi ý** để tránh ô trống | Lưu bền |

→ Preset chỉ là nút bấm cho nhanh lúc tạo; sau đó **role + description mới là dữ liệu thật** dùng để điều phối.

#### 6 — Song song, sub-room, thợ tạm — ba thứ khác nhau (đừng gộp)

| Nhu cầu | Giải pháp | Trạng thái |
|---|---|---|
| **Việc lớn cần xử lý song song** | Orchestrator **dispatch nhiều agent hiện có** cùng lúc (concurrency cap) | 🔜 MVP đủ dùng |
| **Tổ chức khi room quá đông** (20+ agent) | **Sub-room** — room con có orchestrator riêng; hierarchy nổi lên qua **lồng room**, không qua agent→agent (giữ topology "fractal star") | 💡 seam, **defer xa** |
| **Thợ tạm vô danh dùng-một-lần** (kiểu Cursor sub-agent) | **Bot / execution plane** (JS trong sandbox), không phải agent có hồn | 💡 seam, **defer xa** |

> Song song (làm ngay) = dispatch nhiều **agent thật**, KHÔNG cần đẻ khái niệm mới. Sub-room chỉ để **tổ chức**, không phải để chạy song song. Thợ tạm vô danh map vào **Bot**, xem [Bot Workflow](#bot-workflow--thiết-kế-mở-rộng-tham-khảo-khi-scale).

#### Trigger workflow & chống nghẽn

**Workflow kích hoạt bằng gì** (không `command` /slash gọi Bot trực tiếp):

| Trigger | Ai kích | User trong luồng? |
|---|---|---|
| `schedule` | hệ thống theo lịch (cron) | Không (tự chạy 9h sáng) |
| `event` | webhook / DB event / listener | Không |
| `agent-invoked` | **Agent** (do user tag giao việc) | Có — gián tiếp qua Agent |

**Chống nghẽn (concurrency):** mỗi yêu cầu = **1 run / task lane độc lập**, các run chạy **song song**; **serialize trong từng run** để 2 tin không đè context. Room chỉ là **khung nhìn chung** — mọi member thấy cùng stream qua WebSocket per-conversation. Việc nặng **tách khỏi luồng chat** (enqueue job / Bot Workflow) → chat không treo chờ.

**Guardrails:** concurrency cap số LLM call song song (tránh burst token + rate limit); turn budget mỗi request. Vì đã bỏ agent→agent (star thuần), **không còn** rủi ro handoff vô tận.

### Model dữ liệu — **✅ Conversation** · 💡 phần còn lại

```text
Conversation                    # ✅ Room hoặc Session
  id, ownerId (= userId)         # chủ sở hữu; seam cho membership sau
  type: room | session          # thêm `direct` (DM) sau = additive enum
  title, description?
  lastMessageAt, createdAt

Agent                           # 💡 core/agents/
  id, ownerId?                   # null = system agent (Quick Assistant, @Trợ Lý, Mother)
  isSystem, presetId             # quick-assistant | orchestrator | mother | custom
  name, instructionsCompiled, enabledSkillGroups, …

Message                         # 💡 kế tiếp — agent reply
  id, conversationId, ownerId    # mang ownerId để sau shard theo tenant
  senderType: user | agent | system
  agentId?, content, createdAt

ConversationMember              # 💡 Phase 1 agents — gắn agent ↔ hội thoại
  conversationId
  memberType: user | agent
  userId? | agentId?
  isDefault                      # session → Quick Assistant (true)
  role: owner | admin | member | viewer
```

**Provision khi tạo hội thoại (planned):**

| `type` | Auto member |
|--------|-------------|
| `session` | **Quick Assistant** (`isSystem`, `isDefault: true`) |
| `room` | **@Trợ Lý** (`isSystem` orchestrator) — user add user-agent sau |

**Module API:** `core/conversations/` — **✅** CRUD Room + Session. `core/agents/` — **💡** system seed + user CRUD + resolve. Mọi truy cập đi qua **1 checkpoint** — xem [Chiến lược mở rộng](#chiến-lược-mở-rộng-mvp-đơn-nhất--super-app-cộng-tác).

### URL & routing — **✅ đã làm (web)**

| Môi trường | Landing / auth | App chat |
|------------|----------------|----------|
| Dev | `localhost:8386` · `/login` | `localhost:8386/app` |
| Prod | `www.aucobot.com` | `app.aucobot.com` |

| URL | Ý nghĩa |
|-----|---------|
| `/app` | Shell — chưa chọn hội thoại (empty state) |
| `/app#clx9abc` | Mở `Conversation` id `clx9abc` (Room hoặc Session) |

- **✅** `proxy.ts` — host marketing vs app; dev path `/app` trên cùng `localhost`
- **✅** `use-conversation-id-from-hash` — đọc / set hash `#conversationId`
- **✅** `ClientAppShell` — sidebar list thật + create room/session + meta panel

### API Phase 1 — **🔜 contract dự kiến**

| Method | Path | Ghi chú |
|--------|------|---------|
| GET | `/api/conversations` | Sidebar list |
| POST | `/api/conversations` | `{ type: "room" \| "session", title, description? }` |
| GET | `/api/conversations/:id` | Meta |
| GET | `/api/conversations/:id/messages` | **💡** history |
| POST | `/api/conversations/:id/messages` | **💡** user gửi tin |

WebSocket **💡:** `WSS /api/ws/conversations/:id` (tên cũ trong doc: `.../departments/:id`).

### Đã làm vs chưa — Phase 1 chat

| Hạng mục | Trạng thái |
|----------|------------|
| Auth OTP + Google, cookie cross-subdomain (prod) / localhost (dev) | ✅ |
| Subdomain web: `site/` marketing + `app/` chat shell | ✅ |
| Landing page + login/register | ✅ |
| Hash routing mở hội thoại (`#conversationId`) | ✅ |
| Sidebar list Room + Session (API thật) | ✅ |
| Prisma `Conversation` (messages 💡) | ✅ |
| API conversations CRUD | ✅ |
| UI tạo phòng (Telegram-style form) | ✅ |
| UI tạo phiên | ✅ |
| UI tạo phiên (Quick Assistant auto-bind 💡) | ✅ form · 🔜 backend member |
| Quick Assistant (system) + chat zero-setup | 🔜 `core/agents/` seed + resolver |
| User agent catalog + Mother wizard | 💡 |
| Add user-agent vào Room | 💡 |
| DM agent (danh bạ) | 💡 |
| AI reply + WebSocket stream | 💡 |

---

## MVP — Tính năng

### Ưu tiên phát triển

```text
✅ Đã làm:     Auth, web shell, landing, hash routing, conversations CRUD, Docker API, CI
🔜 Phase 1:    Quick Assistant (session zero-setup) + messages + stream
💡 Sau Phase 1: User agents (Mother), Room orchestrator, MCP social, approval, publish, BullMQ worker
```

### Mô hình sản phẩm dài hạn — **💡 ý tưởng** (trong mỗi Room)

```text
User
 └── Room (Phòng) — thay Department; user tạo chủ động, Telegram-style
      ├── Brand kit chung (tone, ngành, quy tắc)          💡
      ├── Document library (brochure, brief…)               💡
      ├── Agents (preset + tùy chỉnh sau)                   💡
      │    ├── Orchestrator — nhận lệnh user, chia việc
      │    ├── Content — viết caption
      │    ├── Scheduler — lên lịch
      │    └── Publisher — đăng FB/TikTok via MCP
      ├── Approval queue — bài chờ user duyệt             💡
      └── Jobs / audit — trạng thái + lịch sử               💡
```

### Tính năng P0 — full product **💡 ý tưởng** (sau Phase 1 chat)

| # | Tính năng | API / ghi chú |
|---|-----------|---------------|
| 1 | **Auth + session** | ✅ Passport + JWT httpOnly cookie |
| 2 | **OAuth Facebook + TikTok** | 💡 Lưu token encrypt trong `social_accounts` |
| 3 | **Room / Session CRUD** | ✅ conversations · 🔜 auto-bind system agent |
| 4 | **Quick Assistant (Session)** | 🔜 System agent ship sẵn — chat zero-setup |
| 5 | **User agent + Mother** | 💡 Wizard → user agent cho Room |
| 6 | **Tool allowlist / agent** | 💡 MCP tools per agent |
| 7 | **MCP tools — social** | 💡 |
| 8 | **MCP tools — knowledge** | 💡 |
| 9 | **Human-in-the-loop** | 💡 |
| 10 | **BullMQ worker** | 💡 |
| 11 | **Task / job status API** | 💡 |
| 12 | **Audit log** | 💡 |
| 13 | **Agent memory / learning** | 💡 |

### Agent setup wizard — **💡 ý tưởng** (API contract)

User không viết raw system prompt — backend sinh từ structured input:

| Bước | Input | Output |
|------|-------|--------|
| 1 | Mẫu ngành (shop, spa, BĐS, custom) | Room + brand kit |
| 2 | Tên thương hiệu, tone, đối tượng KH | Brand kit JSON |
| 3 | Kết nối FB / TikTok | `social_accounts` linked |
| 4 | Chọn agent preset (Content, Scheduler, Publisher) | Agents + tool allowlist |
| 5 | Test sandbox | Chạy thử agent — **không đăng thật** |

Endpoints **💡:** `POST /api/conversations` (room), `POST /api/conversations/:id/agents`, `POST /api/conversations/:id/setup/complete`, `POST /api/conversations/:id/sandbox/run`

### MCP tools — **💡 ý tưởng** (`packages/mcp-core`)

**Social (Facebook + TikTok):**

| Tool | Mô tả |
|------|--------|
| `list_connected_accounts` | Pages / TikTok accounts đã OAuth |
| `create_draft_post` | Sinh / lưu bản nháp caption |
| `schedule_post` | Hẹn giờ (ghi DB + enqueue) |
| `publish_post` | Đăng ngay (sau approve) |
| `get_post_status` | Tra job / post result |
| `get_page_insights` | Engagement cơ bản (phase sớm) |

**Knowledge & research:**

| Tool | Mô tả |
|------|--------|
| `read_document` | Đọc file trong document library |
| `web_search` | Trend, competitor, tham khảo thị trường |
| `update_agent_memory` | Ghi insight học được theo user/room |

**Orchestration (orchestrator → agent, star thuần):**

> Topology **hình sao** — agent **không** gọi agent (bỏ `handoff_to_agent`). Điều phối do orchestrator `@Trợ Lý` làm trung gian. Xem [Luồng tương tác trong Room](#luồng-tương-tác-trong-room--ai-trả-lời-💡-ý-tưởng).

| Tool | Mô tả |
|------|--------|
| `dispatch_to_agent` | Orchestrator giao việc cho 1 agent + thu kết quả (không phải agent tự gọi agent) |
| `list_pending_approvals` | Orchestrator liệt kê bài chờ duyệt |

### Approval queue & job state machine — **💡 ý tưởng**

```text
draft → pending_approval → approved → scheduled → publishing → published
                        ↘ rejected
                        ↘ failed (retry tối đa N lần)
```

API **💡:** `GET /api/conversations/:id/approvals`, `POST /api/approvals/:id/approve`, `POST /api/approvals/:id/reject`

### Defer (post-MVP v1) — **💡**

| Tính năng | Lý do |
|-----------|--------|
| Unlimited custom agents | Preset 3–4 agent đủ demo |
| Comment / inbox automation | Scope & risk cao |
| RAG / pgvector | Doc ngắn → context window |
| Analytics agent riêng | Sau khi có insights API ổn |
| Billing / team workspace | Sau product-market fit |

### Schema DB — **💡 ý tưởng** (bổ sung Prisma)

| Model | Vai trò |
|-------|---------|
| `Conversation` | Room hoặc Session — **thay `Department`** |
| `Message` | Tin nhắn trong hội thoại |
| `Agent` | Agent AI — **system** (Quick Assistant, @Trợ Lý, Mother) + **user** (Mother đẻ, dùng trong Room) |
| `Block` | Khối Lego hệ thống (vetted catalog) — đơn vị 1-việc để agent ghép |
| `Bot` | Automation (Block ghép + glue) — con trỏ version active + owner/tier; user bật/tắt/sửa/xóa |
| `BotTemplate` | Khung workflow hướng dẫn Agent nối Block (trigger `schedule`/`event`/`agent-invoked`) |
| `BotVersion` | Artifact **bất biến** của Bot: graph Block + glue JS + I/O schema; rollback = đổi con trỏ |
| `WorkflowRun` | Một lần chạy Bot — trạng thái tổng |
| `WorkflowStep` | Output từng node — truyền N→N+1 + resume |
| `BrandKit` | Tone, rules, industry template |
| `Approval` | Hàng đợi duyệt bài |
| `AgentMemory` | Learning JSON per room/agent |
| `AuditLog` | Who / which agent / what / when |

**✅ Models hiện có:** `User`, `RefreshToken`, `EmailOtpChallenge` — xem `packages/database/prisma/schema.prisma`

---

## Chiến lược mở rộng: MVP đơn nhất → Super App cộng tác

> **Mục tiêu:** hiện tại code **đơn giản nhất có thể** (1 user + AI agent marketing), nhưng **thiết kế sẵn "khoảng trống" (seams)** để lên super-app cộng tác **mà không phải đập đi xây lại**.
>
> **Nguyên tắc vàng:** *Làm ít nhất — chừa chỗ đúng chỗ.* Mỗi vòng phát triển chỉ được phép **thêm bảng / thêm cột nullable / thêm 1 checkpoint** — **không** sửa cấu trúc vòng trước (không `DROP`, không `RENAME`, không đổi kiểu).

### Ba vòng đồng tâm (product evolution)

| Vòng | Ai dùng | Năng lực | Trạng thái |
|------|---------|----------|------------|
| **1 — MVP cá nhân** | 1 user | Session (Quick Assistant, chat ngay) + Room shell; user-agent marketing **💡** | 🔜 trọng tâm hiện tại |
| **2 — Cộng tác** | User + đồng nghiệp | Mời bạn vào Room (Telegram-style), giao việc, xem chung, nhiều agent / room | 💡 |
| **3 — Super app** | Team / Org | **RBAC** phân quyền: ai được dùng agent nào; workspace/org; billing team | 💡 |

Trọng tâm code **bây giờ chỉ là Vòng 1**. Vòng 2–3 chỉ cần **chừa seam**, không implement.

### Tenancy tiến hóa: owner → membership → workspace

Đây là quyết định kiến trúc **quan trọng nhất** cho super-app. Chốt hướng: **giữ MVP phẳng, tập trung quyền vào 1 chỗ**.

**Hiện tại (MVP):** `Conversation.userId` = **chủ sở hữu (owner)**. Không bảng Workspace, không membership, không role. Đơn giản nhất.

**Seam làm ngay (rất rẻ — chỉ là kỷ luật code, không thêm bảng):**

| # | Seam | MVP làm gì | Lợi ích tương lai |
|---|------|-----------|-------------------|
| 1 | Ngữ nghĩa `userId` = **ownerId** | Không đổi tên cột cũng được, chỉ hiểu đúng | Thêm co-owner/member không mâu thuẫn |
| 2 | **1 checkpoint quyền duy nhất** — ✅ đã áp | `ConversationAccessService.assert(userId, conversationId)` (`core/conversations/conversation-access.service.ts`) — MVP check owner. **Cấm** rải `where userId` khắp service | Thêm membership/RBAC = sửa **đúng 1 method** |
| 3 | **Mang tenant id trên bảng con** | Bảng `Message` mang cả `ownerId` (không chỉ `conversationId`) | Shard theo tenant sau không cần JOIN ngược |

**Migration path (mọi bước additive, không downtime, không rewrite):**

```text
Vòng 1 (MVP)       Conversation.ownerId = userId
                   + ConversationMember(agent) — session→Quick Assistant, room→@Trợ Lý  💡
                   access = (ownerId == me)                     ← 1 method

Vòng 2 (cộng tác)  + ConversationMember(user) — mời đồng nghiệp
                   backfill: mỗi conversation → 1 member (owner)
                   access = EXISTS(member)                      ← sửa đúng 1 method

Vòng 3 (org)       + Workspace + WorkspaceMember
                   + Conversation.workspaceId (nullable → backfill personal workspace)
                   access = role theo workspace + per-agent grant
```

Vì tất cả là **thêm bảng / cột nullable + backfill** → không có thao tác phá hủy.

### RBAC — phân quyền đồng nghiệp dùng agent (Vòng 3, 💡)

```text
Workspace              # tổ chức / team (Vòng 3); MVP: mỗi user = 1 personal workspace ngầm
  id, ownerId, name

WorkspaceMember        # đồng nghiệp trong workspace
  workspaceId, userId
  role: owner | admin | member | viewer

AgentGrant             # ai được dùng agent nào — cốt lõi "phân quyền agent"
  workspaceMemberId, agentId
  canUse, canConfigure
```

- **Role** quyết định quyền mặc định; **AgentGrant** override ở mức từng agent (vd: cho đồng nghiệp X chỉ dùng agent "Content", cấm agent "Publisher").
- Kiểm tra quyền vẫn đi qua **cùng 1 checkpoint** đã dựng từ MVP → chỉ mở rộng logic bên trong.

### Chiến lược ID

| Nguyên tắc | Hiện trạng | Lý do cho tương lai |
|------------|-----------|---------------------|
| **ID chuỗi toàn cục** (không auto-increment int) | ✅ `cuid()` | Merge / shard / multi-region **không đụng khóa** — int tăng dần sẽ đụng nhau giữa shard |
| PK/FK luôn cùng kiểu string | ✅ | Đổi storage không gãy quan hệ |
| Không lộ thứ tự / số lượng qua ID | ✅ cuid random | Bảo mật, tránh enumeration |
| **UUIDv7 cho bảng append-only / ghi nặng** — ✅ đã áp | `RefreshToken`, `EmailOtpChallenge` dùng `@default(uuid(7))` | ID sortable theo thời gian → index locality tốt; áp tiếp cho `Message`, `AuditLog` khi có |

**Chốt:** entity tables (`User`, `Conversation`) giữ `cuid()` — global-unique, id hiển thị trên URL hash. Bảng **append-only / ghi nặng** (`RefreshToken`, `EmailOtpChallenge`, tương lai `Message`, `AuditLog`) dùng **`@default(uuid(7))`** cho index locality. Vì `cuid()`/`uuid()` là default sinh **phía client** (không có DB default) → đổi generator **không tạo migration SQL**, non-breaking hoàn toàn.

### Chiến lược tách DB khi nhiều user (thang 5 nấc)

Tách DB là quyết định **theo metric**, không làm sớm. Mỗi nấc chỉ leo khi nấc dưới hết dư địa.

| Nấc | Kỹ thuật | Kích hoạt khi | Seam cần có sẵn từ MVP |
|-----|----------|---------------|------------------------|
| **0** | 1 Postgres + index + query tuning | luôn (hiện tại) | Index đúng ✅ |
| **1** | Connection pool (PgBouncer) | Nhiều kết nối từ serverless / nhiều replica API | Không cần code |
| **2** | **Read replica** (đọc → replica, ghi → primary) | Đọc nặng (list, history) áp đảo ghi | Tách read/write **trong 1 chỗ** (`PrismaService`) |
| **3** | **Vertical split theo domain** (`messages`, `audit`, `jobs` → DB/service riêng) | 1 domain phình lấn át phần còn lại | **Feature sở hữu bảng riêng + không JOIN chéo domain ở SQL** |
| **4** | **Horizontal shard theo tenant** (`workspaceId`) | Quá nhiều tenant cho 1 node | **`tenant_id` trên mọi bảng + ID toàn cục + không FK chéo shard** |

**Seam rẻ cho tách DB (giữ/làm từ MVP):**

1. **ID chuỗi toàn cục** — đã có (nấc 4 không cần đổi ID).
2. **Mang `ownerId`/`workspaceId` trên mọi bảng thuộc tenant** (kể cả `Message`) — cho phép shard theo tenant mà không JOIN ngược. Chi phí: 1 cột, gần như free.
3. **Không JOIN chéo domain ở tầng SQL** — nếu cần dữ liệu 2 domain, join ở tầng app. Chuẩn bị cho nấc 3.
4. **Feature sở hữu bảng riêng** — `messages` thuộc conversations, `jobs`/`post_results` thuộc publishing, `audit_logs` thuộc audit. Ranh giới rõ = tách vertical không gỡ rối.

**Kết luận:** cấu trúc hiện tại (Postgres shared multi-tenant + ID toàn cục + `userId` trên bảng gốc) **đủ điều kiện leo cả 5 nấc mà không rewrite** — miễn giữ 4 seam trên. Không cần làm gì thêm ở MVP ngoài kỷ luật khi thêm bảng mới.

### Model DB tiến hóa (hiện tại → tương lai)

| Model | Vòng | Vai trò |
|-------|------|---------|
| `User`, `RefreshToken`, `EmailOtpChallenge` | 1 | ✅ Identity + auth |
| `Conversation` (`ownerId`, `type`) | 1 | ✅ Room / Session |
| `Message` (`conversationId`, `ownerId`, `senderType`) | 1 | 🔜 kế tiếp — agent marketing reply |
| `Agent` (user tạo — AI reasoning) | 2 | 💡 |
| `Bot` + `BotTemplate` + `BotVersion` + `WorkflowRun` + `WorkflowStep` (workflow JS Agent xây, chạy sandbox) | 2+ | 💡 xem [Bot Workflow](#bot-workflow--thiết-kế-mở-rộng-tham-khảo-khi-scale) |
| `ConversationMember` (user \| agent, role) | 2 | 💡 mời đồng nghiệp / gắn agent |
| `Workspace`, `WorkspaceMember` | 3 | 💡 tổ chức + phân quyền |
| `AgentGrant` | 3 | 💡 ai được dùng agent nào |
| `SocialAccount`, `Approval`, `ScheduledPost`, `AuditLog` | feature | 💡 theo từng feature plugin |

Mỗi dòng mới = **thêm bảng**, tham chiếu `conversationId`/`ownerId` — **additive, không đụng bảng cũ**.

---

## Kiến trúc MVP (đã chốt)

### Nguyên tắc

| Nguyên tắc                     | Mô tả                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Multi-tenant shared**        | Mọi user dùng chung PostgreSQL, Redis, worker pool — phân biệt bằng `user_id` |
| **Không container/user**       | Scale theo **queue job**, không scale theo số user                            |
| **API + Worker gộp**           | MVP: một Railway service chạy cả NestJS HTTP và BullMQ worker                 |
| **Frontend tách biệt**         | Next.js trên Vercel; worker không public internet                             |
| **Postgres = source of truth** | Redis/BullMQ chỉ là transport; mất Redis có thể rebuild job từ DB             |

### Sơ đồ deploy MVP

```
┌─────────────────────────────────────────────────────────────────┐
│                         End User (Browser)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vercel — apps/web (Next.js)                                     │
│  • UI Telegram-style: thread list + chat stream (frontend mỏng) │
│  • Chỉ gọi REST + WebSocket — KHÔNG gọi worker trực tiếp        │
└───────────────────────────────┬─────────────────────────────────┘
                                │ NEXT_PUBLIC_API_URL
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Railway — apps/api (1 service, 1 replica MVP)            │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  NestJS HTTP :4000  │  │  BullMQ Worker (cùng process)   │   │
│  │  /api/*             │  │  queue: publish-post, …         │   │
│  └──────────┬──────────┘  └──────────────┬──────────────────┘   │
└─────────────┼─────────────────────────────┼───────────────────────┘
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  Railway — PostgreSQL   │   │  Railway — Redis        │
│  • users, tokens        │   │  • delayed jobs         │
│  • scheduled_posts      │   │  • retry / concurrency  │
│  • documents, …         │   │                         │
└─────────────────────────┘   └─────────────────────────┘
              │
              ▼ (khi worker chạy job)
┌─────────────────────────────────────────────────────────────────┐
│  External APIs (pay-as-you-go)                                   │
│  • Together AI — sinh caption                                    │
│  • Facebook Graph API — đăng bài (v1)                            │
│  • TikTok Marketing API — defer v1.1                             │
└─────────────────────────────────────────────────────────────────┘
```

### Bảng service MVP

| Service            | Nơi chạy             | Bắt buộc       | Vai trò                            |
| ------------------ | -------------------- | -------------- | ---------------------------------- |
| **web**            | Vercel               | ✅             | Giao diện người dùng               |
| **api**            | Railway              | ✅             | REST + WebSocket, webhook, enqueue job |
| **Worker**         | Gộp trong api        | ✅             | Consumer BullMQ — đăng bài hẹn giờ |
| **PostgreSQL**     | Railway plugin       | ✅             | Dữ liệu persistent, multi-tenant   |
| **Redis**          | Railway plugin       | ✅             | BullMQ queue                       |
| **Together AI**    | External             | ✅ (khi có AI) | LLM pay-per-token                  |
| **Meta Graph API** | External             | ✅ (v1 FB)     | OAuth + publish                    |
| **Object Storage** | R2/S3                | ⚠️ Tùy chọn    | Khi upload file/media              |

**Chi phí hạ tầng ước tính:** ~$10–15/tháng (Railway PG + Redis + api) + Vercel free tier.

### Luồng tạo lịch đăng bài

```
1. User (web) → POST /api/scheduled-posts
2. api:
   • validate + ghi scheduled_posts (PostgreSQL, status=SCHEDULED)
   • queue.add('publish-post', { postId }, { delay, jobId: idempotencyKey })
   • trả 201 ngay — không chờ đăng xong
3. Worker (cùng process, đến runAt):
   • đọc post + social_accounts theo user_id
   • gọi Facebook/TikTok API
   • cập nhật status PUBLISHED | FAILED + post_results
4. web nhận event `job.status` qua WebSocket (cùng socket conversation) **💡**
```

**Frontend không bao giờ gọi worker.** User → API (REST) → Queue → Worker → API push (WS).

### Giao thức client web (đã chốt): REST + WebSocket

**Không dùng GraphQL.** Một client chính (`apps/web`); contract Zod trong `@aucobot/shared`.

| Kênh | Vai trò | Web layer |
|------|---------|-----------|
| **REST** | Lệnh user, CRUD, snapshot ban đầu | `lib/http` → `lib/api/*` |
| **WebSocket** | Push realtime: stream agent, job, approval | `lib/stream/*` |

```text
User action (gửi tin, duyệt, setup)
  → REST POST/GET /api/*
  → API xử lý (NestJS + worker)

Server push (chunk agent, job done, approval đổi)
  → WSS /api/ws/conversations/:conversationId   💡 (tên cũ: .../departments/:id)
  → JSON event envelope (Zod trong @aucobot/shared)
  → web: lib/stream → hooks → stores → UI
```

**REST — ví dụ:**

| Method | Path | Mục đích |
|--------|------|----------|
| POST | `/api/conversations/:id/messages` | User gửi tin → API bắt đầu agent **💡** |
| GET | `/api/conversations/:id/messages` | History / snapshot **💡** |
| POST | `/api/approvals/:id/approve` | Duyệt bài |
| POST | `/api/scheduled-posts` | Tạo lịch đăng |

**WebSocket — một connection / conversation khi mở chat:** **💡**

| Event `type` | Hướng | Mục đích |
|--------------|-------|----------|
| `message.chunk` | S→C | Stream từng mảnh câu trả lời agent |
| `message.done` | S→C | Kết thúc tin |
| `approval.updated` | S→C | Trạng thái duyệt đổi |
| `job.status` | S→C | Job đăng bài: scheduled → published / failed |
| `ping` / `pong` | C↔S | Keepalive |

**Auth WS:** cookie `httpOnly` lúc HTTP Upgrade (cùng site `app.` / `api.`) — **cấm** secret trên query string.

**API stack:** NestJS `@nestjs/websockets` + adapter `ws` (native). Scale sau: Redis pub/sub giữa replicas.

**Poll REST** (`GET scheduled-posts/:id`) chỉ fallback dev — production dùng `job.status` trên WS.

### Xử lý đột biến nhiều user đăng cùng lúc

Đột biến lo ngại là **job queue**, không phải HTTP traffic.

| Cơ chế                      | Mục đích                             |
| --------------------------- | ------------------------------------ |
| BullMQ **delayed job**      | Không cron quét từng user            |
| **Concurrency cap** (vd: 5) | Giới hạn job song song toàn platform |
| **Rate limit** Meta/TikTok  | Tránh ban API                        |
| **Jitter nhẹ**              | Tránh burst cùng giây                |
| **Idempotency key**         | Retry không đăng trùng               |

Một worker shared xử lý hàng trăm job xếp hàng — không cần 1 worker/user.

### Kiến trúc API: Core + Features (plugin) — **✅ toggle qua config; 💡 feature module**

> **Trạng thái thực tế:**
> - **✅ Feature toggle qua config** — `core/features/`: env `ENABLED_FEATURES` (CSV, Zod validate chặn typo), `FeatureFlagsService` (`isEnabled`/`assertEnabled`/`getEnabled`), `feature-loader.ts` (`loadEnabledFeatures()` nạp module theo config). `app.module.ts`: `imports: [CoreModule, ...loadEnabledFeatures()]`. Registry **rỗng ở MVP** — thêm feature = thêm 1 dòng.
> - **Còn phẳng:** các module core khác (`auth`, `conversations`…). **Chưa có** `features/*` module thật, `plugins/` (FeaturePlugin interface), `events/`, `queue/`, `agents/`.
> - Đây là **chủ đích — không over-engineer**: hạ tầng bật/tắt đã sẵn, chỉ dựng event bus / plugin interface khi có feature thật để cắm.
>
> **Thêm feature (2 bước):** (1) tạo `features/<name>/<name>.module.ts` (module thường, *không import feature khác*); (2) đăng ký vào `FEATURE_REGISTRY` trong `feature-loader.ts` rồi thêm id vào `ENABLED_FEATURES`. Thêm `@nestjs/event-emitter` **chỉ khi** có tương tác chéo đầu tiên (`approvals → publishing`). Xem [`core/features/README.md`](apps/api/src/core/features/README.md).

API chia **`src/core`** (nền tảng bắt buộc) và **`src/features`** (cắm / rút như plugin). Core **không phụ thuộc** feature nào; feature chỉ phụ thuộc core qua **contract** (interface / event).

#### Nguyên tắc

| Nguyên tắc | Mô tả |
|------------|--------|
| **Core luôn chạy** | Auth, health, conversations shell, agent registry, queue infra, audit — tắt feature không làm sập API |
| **Feature độc lập** | Mỗi feature = 1 NestJS `DynamicModule` + manifest; bật/tắt qua env hoặc config |
| **Core không import feature** | `core/` không được `import` từ `features/` |
| **Feature không import feature** | Feature A ↔ Feature B qua **event bus** hoặc contract trong `core/plugins` |
| **MCP tools đăng ký qua plugin** | Feature social đăng ký tool vào registry lúc bootstrap — gỡ feature = gỡ tool |

```text
                    ┌─────────────────────────────────┐
                    │  app.module.ts                  │
                    │  imports: CoreModule + enabled  │
                    │           FeatureModules[]      │
                    └───────────────┬─────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
    ┌─────────────────────┐                 ┌─────────────────────┐
    │  src/core           │                 │  src/features         │
    │  (bắt buộc)         │◄── contract ────│  (cắm / rút)          │
    │                     │    only         │                       │
    │  auth, conversations│                 │  facebook, tiktok     │
    │  agents, queue,     │                 │  publishing, approvals│
    │  plugins registry   │                 │  documents, web-search│
    └─────────────────────┘                 └─────────────────────┘
```

#### `src/core` — nền tảng bắt buộc

Core gồm **4 lớp**. Tắt bất kỳ feature nào, core vẫn chạy — app vẫn là nền tảng “phòng marketing ảo”.

**Lớp 1 — Infrastructure**

| Module | Vai trò |
|--------|---------|
| `common/` | Decorators (`@CurrentUser`), filters, interceptors, middleware, pipes (Zod), utils — **không** chứa business logic |
| `config/` | Env validation (Zod) |
| `features/` | ✅ Feature toggle qua config — `ENABLED_FEATURES`, `FeatureFlagsService`, `loadEnabledFeatures()` |
| `database/` | PrismaService, transaction helper |
| `logging/` | Pino, request-id, structured log |
| `health/` | `/api/health`, readiness |

**Lớp 2 — Identity**

| Module | Vai trò |
|--------|---------|
| `auth/` | Passport, JWT httpOnly cookie, guards, strategies |
| `users/` | User CRUD, profile, timezone — tenant identity |

**Lớp 3 — Plugin platform**

| Module | Vai trò |
|--------|---------|
| `plugins/` | `FeaturePlugin` interface, registry, loader từ `ENABLED_FEATURES` |
| `events/` | Event bus — feature **không import nhau**, chỉ emit/listen |
| `audit/` | Audit log — mọi feature ghi qua core |
| `queue/` | Redis/BullMQ **connection + factory** — không chứa processor nghiệp vụ |

**Lớp 4 — Domain shell (khung sản phẩm)**

| Module | Vai trò |
|--------|---------|
| `conversations/` | Room + Session — CRUD, messages **🔜** (folder cũ: `departments/`) |
| `agents/` | **💡** System agents (Quick Assistant, @Trợ Lý, Mother) + user CRUD + `AgentResolver` + tool allowlist |

**`common/` chi tiết:**

| Thư mục | Ví dụ |
|---------|--------|
| `decorators/` | `@CurrentUser()`, `@Public()`, `@RequireConversation()` **💡** |
| `filters/` | `HttpExceptionFilter`, `ZodExceptionFilter` |
| `interceptors/` | `LoggingInterceptor`, `TransformInterceptor` |
| `middleware/` | `RequestIdMiddleware` |
| `pipes/` | `ZodValidationPipe` |
| `utils/` | `encryptToken`, `parseTimezone` — helpers thuần |

**Ranh giới core vs feature:**

| Thuộc core | Thuộc feature |
|------------|---------------|
| User, auth, conversation shell, agent registry | OAuth Facebook/TikTok, MCP tools social |
| Queue connection | Publish processor, job state machine |
| Event bus + schema | Listener/producer cụ thể |
| Plugin registry | `facebook.plugin.ts`, `publishing.plugin.ts` |

#### `src/features` — plugin (bật/tắt)

| Feature | Vai trò | Phụ thuộc |
|---------|---------|-----------|
| `facebook` | OAuth Meta, MCP tools FB | core + `social-providers` |
| `tiktok` | OAuth TikTok, MCP tools TikTok | core + `social-providers` |
| `publishing` | Schedule + publish processor, job state | core `queue`, `events` |
| `approvals` | Human-in-the-loop, approval queue API | core `events` |
| `documents` | Upload, extract text, `read_document` tool | core `conversations` **💡** |
| `web-search` | `web_search` tool (Tavily/Serper) | core `agents` |
| `ai-orchestration` | Vercel AI SDK, agent chat, orchestrator dispatch (star) | core `agents`, `llm-services` |

Bật/tắt ví dụ:

```env
ENABLED_FEATURES=facebook,tiktok,publishing,approvals,documents,ai-orchestration
# Tắt tiktok → bỏ khỏi list, core + FB vẫn chạy
```

#### Contract plugin (`core/plugins`)

Mỗi feature implement `FeaturePlugin`:

```typescript
// core/plugins/feature-plugin.interface.ts
export interface FeaturePlugin {
  readonly id: string;                    // 'facebook' | 'tiktok' | ...
  readonly mcpTools?: McpToolDefinition[]; // tools đăng ký cho agent
  registerModule(): DynamicModule;         // NestJS module
  onEnable?(registry: PluginRegistry): void;
  onDisable?(): void;
}
```

- **Agent** trong core chỉ thấy tools từ registry — không biết Facebook/TikTok cụ thể.
- Gỡ feature `tiktok` → registry không còn TikTok tools → agent TikTok-publisher không assign được tool đó.

#### Giao tiếp giữa features (không import chéo)

```text
Feature documents  ──emit──►  PostDraftCreated
Feature ai         ──listen──►  sinh caption
Feature approvals  ──listen──►  chờ duyệt
Feature publishing ──listen──►  ApprovalGranted → enqueue job
```

Event names + payload Zod schema đặt trong `@aucobot/shared` hoặc `core/events`.

#### Cấu trúc thư mục `apps/api`

```
apps/api/src/
├── main.ts
├── worker.ts
├── app.module.ts              # CoreModule + loadEnabledFeatures()
│
├── core/
│   ├── core.module.ts
│   ├── common/                # decorators, filters, interceptors, pipes, utils
│   ├── config/
│   ├── database/
│   ├── logging/
│   ├── health/
│   ├── auth/
│   ├── users/
│   ├── conversations/         # 🔜 Room + Session (placeholder: departments/)
│   ├── agents/
│   ├── queue/
│   ├── events/
│   ├── audit/
│   └── plugins/
│       ├── feature-plugin.interface.ts
│       ├── plugin.registry.ts
│       └── feature-loader.ts
│
└── features/
    ├── index.ts               # export all plugins + manifest
    ├── facebook/
    │   ├── facebook.plugin.ts
    │   ├── facebook.module.ts
    │   └── ...
    ├── tiktok/
    ├── publishing/
    ├── approvals/
    ├── documents/
    ├── web-search/
    └── ai-orchestration/
```

#### Scale: rút plugin → tách service riêng (giống WordPress)

Kiến trúc core + features được thiết kế theo mô hình **modular monolith trước, microservices sau** — tương tự WordPress core + plugins, nhưng typed và contract rõ ràng hơn.

| WordPress | Aucobot |
|-----------|---------|
| WordPress **core** | `apps/api/src/core` |
| **Plugin** cắm vào core | `apps/api/src/features/*` |
| Plugin tắt = không load | `ENABLED_FEATURES` bỏ id |
| Plugin nặng (WooCommerce) có thể tách server riêng | Feature `publishing` / `ai-orchestration` tách deploy sau |

**3 giai đoạn scale (không rewrite):**

```text
Phase 1 — MVP (hiện tại)
  apps/api (1 process)
    CoreModule + FeatureModules[]  ← plugin in-process (NestJS DynamicModule)

Phase 2 — Tách deploy, cùng repo
  apps/api          → HTTP + core + features nhẹ
  apps/worker       → chỉ feature publishing processors (cùng codebase, entry khác)
  hoặc
  packages/feature-publishing → import vào worker service riêng trên Railway

Phase 3 — Microservice (dự án lớn)
  api-core          → auth, users, conversations, agents, plugin gateway
  svc-facebook      → feature facebook (HTTP/gRPC nội bộ)
  svc-publishing    → worker + queue consumer
  svc-ai            → ai-orchestration
  Giao tiếp: Redis Streams / SQS + contract Zod trong @aucobot/shared
```

**Điều kiện để tách feature thành service mà không vỡ hệ thống** (làm từ MVP):

| Quy tắc | Mục đích |
|---------|----------|
| Feature **không import** feature khác | Thay bằng event / HTTP contract |
| Event payload **Zod schema** trong `@aucobot/shared` | Service mới implement cùng contract |
| MCP tools đăng ký qua **registry** | Remote feature = remote tool provider |
| Core **không biết** Facebook/TikTok cụ thể | Chỉ biết `FeaturePlugin.id` |
| DB: shared Postgres giai đoạn đầu → schema per service sau | Tránh premature split DB |

**Ví dụ tách `publishing` ra service riêng:**

```text
Trước:  approvals ──event──► publishing (in-process) ──► BullMQ
Sau:    approvals ──event──► Redis Stream ──► svc-publishing (N replica scale)
        api-core vẫn nhận HTTP từ web — không đổi URL public
```

**Kết luận:** Có — khi dự án lớn, mỗi feature có thể thành **service deploy riêng**, scale độc lập, bật/tắt như plugin WordPress — **nếu** giữ contract event + plugin interface từ đầu, không import chéo.

| Tình huống | Cách xử lý |
|------------|------------|
| Bỏ TikTok sau MVP | Xóa `tiktok` khỏi `ENABLED_FEATURES` — không sửa core |
| Scale worker publish | Tách feature `publishing` → service/worker riêng |
| Thêm kênh (Zalo) | Thêm `features/zalo/` hoặc `svc-zalo` — core không đổi |
| Feature AI quá nặng | Tách `svc-ai` — core gọi qua HTTP + streaming |

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/conversations` **🔜** → `core/agents` **💡** → `features/facebook` **💡** → …

MVP: `main.ts` import `CoreModule` + enabled features → worker processors từ feature `publishing`.  
Sau: cùng codebase — `node dist/main.js` (api) hoặc `node dist/worker.js` (worker) hoặc deploy feature thành service riêng.

### Khi nào tách worker khỏi API

Giữ gộp đến khi **≥ 2** điều kiện sau đúng:

- [ ] Queue thường xuyên **> 100 job pending** trong giờ cao điểm
- [ ] API (`/health`, chat) **chậm** khi worker chạy nặng
- [ ] Job **> 30s** (AI + media) ảnh hưởng event loop
- [ ] Cần scale worker **3–5 replica** mà **không** scale API

**Phase 2 (scale):** tách worker → Railway service thứ 2 hoặc AWS Fargate auto-scale theo queue depth.  
**Phase 3:** AWS Fargate/Lambda + scale-to-zero khi idle — khi có metric traffic thật.

### Local development

```bash
docker compose up -d          # PostgreSQL (+ Redis sẽ bổ sung)
pnpm db:migrate
pnpm dev:api                  # http://localhost:4000/api
pnpm dev:web                  # http://localhost:3000
```

| Container | Port | Trạng thái            |
| --------- | ---- | --------------------- |
| postgres  | 5432 | ✅ docker-compose     |
| redis     | 6379 | 🔜 bổ sung cho BullMQ |

---

## Công cụ monorepo

| Công cụ             | Vai trò                                                        |
| ------------------- | -------------------------------------------------------------- |
| **pnpm**            | Package manager **duy nhất** — không dùng npm / yarn            |
| **pnpm workspaces** | Quản lý packages, liên kết nội bộ qua `workspace:*`            |
| **Turborepo**       | Orchestrate build / dev / lint / typecheck xuyên suốt monorepo |
| **TypeScript**      | Ngôn ngữ chung cho toàn bộ apps và packages                    |

### pnpm (bắt buộc)

Monorepo **chỉ** dùng [pnpm](https://pnpm.io). `package-lock.json` / `yarn.lock` không được dùng.

| File / cấu hình | Vai trò |
|-----------------|---------|
| `packageManager` trong root `package.json` | Pin phiên bản pnpm (`pnpm@9.15.0`) — dùng với Corepack |
| `pnpm-workspace.yaml` | Khai báo `apps/*`, `packages/*` |
| `pnpm-lock.yaml` | Lockfile duy nhất — commit vào git |
| `.npmrc` | Cấu hình pnpm workspace |
| `preinstall` + `only-allow` | Chặn `npm install` / `yarn` nhầm |

**Cài đặt lần đầu:**

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
```

**Lệnh thường dùng** (thay cho npm):

| npm (không dùng) | pnpm |
|------------------|------|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| `npm run <script> -w apps/web` | `pnpm --filter @aucobot/web <script>` |


## Sơ đồ thư mục

```
aucobot/
├── apps/
│   ├── api/                     # NestJS @aucobot/api — Core + Features (plugin)
│   └── web/                     # Next.js — frontend mỏng (STRUCTURE.md)
│
├── packages/
│   ├── database/                # Prisma schema + client PostgreSQL
│   ├── shared/                  # Types, constants, Zod schemas
│   ├── social-providers/        # Abstraction Facebook / TikTok API
│   ├── mcp-core/                # MCP tools gọi social providers
│   └── llm-services/            # Vercel AI SDK + Together AI
│
├── docker-compose.yml           # PostgreSQL local
├── .env.dev.example             # Mẫu env development (commit)
├── .env.pro.example             # Mẫu env production (commit)
├── .npmrc                       # Cấu hình pnpm
├── pnpm-lock.yaml               # Lockfile (pnpm only)
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

## Apps

### `apps/api`

Backend NestJS — **`@aucobot/api`**. Gộp API + Worker trong một Railway service (MVP).

| Luồng      | Trách nhiệm                                            |
| ---------- | ------------------------------------------------------ |
| **API**    | REST + WebSocket, webhook, xử lý request từ `web`, enqueue job |
| **Worker** | BullMQ consumer — thực thi job hẹn giờ đăng bài        |

**Phụ thuộc nội bộ:** `@aucobot/database`, `@aucobot/shared`, `@aucobot/social-providers`, `@aucobot/mcp-core`, `@aucobot/llm-services`

**Stack (đã chốt):** xem [Tech Stack — Backend](#tech-stack--backend)

**Kiến trúc code:** `src/core` + `src/features` (plugin) — xem [Kiến trúc API: Core + Features](#kiến-trúc-api-core--features-plugin).

**Endpoints hiện có:** **✅**

| Method | Path | Mô tả |
| ------ | ------------- | ---------------------- |
| GET | `/api/health` | Health + DB |
| POST/GET | `/api/auth/*` | OTP email, Google OAuth, session, me |
| GET | `/api/users` | Danh sách users (dev) |
| POST | `/api/users` | Tạo user (dev) |

**🔜 Phase 1:** `/api/conversations` (Room + Session)

**Cấu trúc thư mục (target):**

```
apps/api/src/
├── main.ts
├── worker.ts
├── app.module.ts
├── core/
│   ├── common/                # decorators, filters, interceptors, pipes, utils
│   ├── config/
│   ├── database/
│   ├── logging/
│   ├── health/
│   ├── auth/
│   ├── users/
│   ├── conversations/         # 🔜 Room + Session (placeholder: departments/)
│   ├── agents/
│   ├── queue/
│   ├── events/
│   ├── audit/
│   └── plugins/
└── features/
    ├── facebook/
    ├── tiktok/
    ├── publishing/
    ├── approvals/
    ├── documents/
    ├── web-search/
    └── ai-orchestration/
```

**Ưu tiên implement:** `core/common` + `core/plugins` → `core/conversations` **🔜** → `core/agents` **💡** → `features/facebook` **💡** → …

### `apps/web`

Frontend Next.js 16 (App Router) — deploy **Vercel**. **Frontend mỏng:** chỉ stream & hiển thị; não nghiệp vụ ở `apps/api`.

**Phụ thuộc nội bộ:** `@aucobot/shared`

**Stack (đã chốt):** xem [Tech Stack — Frontend](#tech-stack--frontend)

**Quy ước UI:**

| Quy ước | Mô tả |
| -------- | ----- |
| **Frontend mỏng** | Next.js + Zustand buffer stream; không logic agent/approval/job trên client |
| **UX Telegram-style** | Sidebar: Room + Session \| chat full-bleed — chat với AI, không dashboard SaaS |
| **CSS Modules** | `ComponentName.module.css` — không Tailwind / UI kit ngoài |
| **Components tự viết** | `components/ui`, `layout`, `chat` |
| **Storybook** | `.stories.tsx` cạnh component — defer đến khi có `components/ui` |

**Sơ đồ folder (đã scaffold — xem `README.md` từng folder):**

> Chi tiết: [`apps/web/STRUCTURE.md`](apps/web/STRUCTURE.md) · rule: [`apps/web/.agent/rule.md`](apps/web/.agent/rule.md)

```text
apps/web/
├── STRUCTURE.md
├── app/
│   ├── site/                      landing + login/register
│   └── app/                       chat shell — `#conversationId` **✅**
├── components/
│   ├── ui/                        Button, Input, Spinner…
│   ├── layout/                    AppShell, SplitPane, Composer
│   └── chat/                      MessageList, Bubble, StreamText
├── hooks/<domain>/                pipe: lib → stores (chat, thread, approval)
├── stores/<domain>/               Zustand stream buffer (message, thread, connection)
├── lib/
│   ├── http/                      client, server-api, api-base-url  [MVP]
│   ├── api/                       REST mirror + Zod  [auth.ts MVP]
│   └── stream/                    WebSocket agent-stream-client  [planned]
├── utils/<domain>/                format hiển thị
├── schemas/                       wrap @aucobot/shared
├── public/
├── scripts/
├── proxy.ts                       host rewrite marketing / app **✅**
└── next.config.ts
```

**Luồng data web:**

```text
apps/api ──REST + WebSocket──► lib/http + lib/stream + lib/api
                                    ▼
                          hooks/<domain>  (pipe)
                                    ▼
                          stores/<domain>  (Zustand)
                                    ▼
                          components/chat + app/(main)
```

**Map `lib/api/` ↔ API domain (thêm file khi có endpoint):**

| `lib/api/` | API |
|------------|-----|
| `auth.ts` ✅ | `/api/auth/*` |
| `conversations.ts` 🔜 | `/api/conversations` (Room + Session) |
| `agents.ts` 💡 | agent preset trong room |
| `messages.ts` 💡 | chat REST |
| `approvals.ts` | approval queue |
| `scheduled-posts.ts` | lịch đăng; status qua WS `job.status` |

**Giao thức:** REST (lệnh) + WebSocket (push) — không GraphQL. Xem [Giao thức client web](#giao-thức-client-web-đã-chốt-rest--websocket).

**Trạng thái web:** **✅** auth, landing, `ClientAppShell`, hash routing, proxy subdomain · **🔜** conversations API + UI tạo phòng Telegram-style

## Tech Stack (đã chốt)

### Nguyên tắc chung

| Nguyên tắc                     | Mô tả                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| **TypeScript everywhere**      | Apps + packages cùng ngôn ngữ                                                                 |
| **Zod single source of truth** | Schema validation API, form client, AI structured output — định nghĩa trong `@aucobot/shared` |
| **Không GraphQL**              | REST + WebSocket đủ cho một web client; Zod trong `@aucobot/shared` |
| **Không LangChain**            | AI qua Vercel AI SDK — gọn, native TS                                                         |
| **Không UI kit ngoài**         | Frontend tự viết components + CSS Modules                                                     |

### Tech Stack — Backend

| Công nghệ             | Package / ghi chú                                                    | Vai trò                                              |
| --------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| **NestJS 11**         | `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/websockets`, `ws` | HTTP REST + WebSocket gateway |
| **Prisma**            | `@aucobot/database`                                                  | PostgreSQL ORM, migrations                           |
| **Zod**               | `nestjs-zod` hoặc custom pipe                                        | Validate request body/query — thay `class-validator` |
| **BullMQ**            | `@nestjs/bullmq`, `bullmq`                                           | Queue delayed job, retry, concurrency                |
| **Redis**             | `ioredis`                                                            | Backend BullMQ                                       |
| **Auth**              | `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`, `passport-oauth2` | OAuth Meta/TikTok + JWT session **httpOnly cookie**  |
| **cookie-parser**     | middleware Nest                                                      | Đọc session cookie                                   |
| **Token encryption**  | `node:crypto` (AES-256-GCM)                                          | Mã hóa OAuth token trong `social_accounts`           |
| **@nestjs/config**    | —                                                                    | Env                                                  |
| **@nestjs/throttler** | —                                                                    | Rate limit API (chống spam job)                      |
| **@nestjs/schedule**  | —                                                                    | Cron refresh token OAuth                             |
| **nestjs-pino**       | `pino`                                                               | Structured logging (job/worker)                      |
| **helmet**            | —                                                                    | Security headers                                     |
| **@nestjs/terminus**  | —                                                                    | Health Redis + DB (sau MVP)                          |

**Auth flow (đã chốt):**

```text
Email (web /login + /register — 2 route, unified verify, Zustand):
  POST /api/auth/email/send-code     → { email, purpose } — KHÔNG tạo user (purpose = email copy)
  POST /api/auth/email/verify-code   → OTP đúng → create nếu mới / login nếu có → Set-Cookie
  POST /api/auth/email/resend-code   → cooldown 60s

Google (web):
  GET /api/auth/google → callback → Set-Cookie

Session:
  web → fetch(API, { credentials: 'include' })
  API → JwtStrategy đọc cookie → req.user.user_id
```

Chi tiết OTP: [`apps/api/src/core/auth/README.md`](apps/api/src/core/auth/README.md) · Web: [`apps/web/app/(auth)/README.md`](apps/web/app/(auth)/README.md).

**Cross-domain (Vercel + Railway):** dùng subdomain chung (`app.` / `api.`) + `Domain=.aucobot.vn` trên cookie.

### Tech Stack — Frontend

| Công nghệ                      | Ghi chú                     | Vai trò                                           |
| ------------------------------ | --------------------------- | ------------------------------------------------- |
| **Next.js 16**                 | App Router, Turbopack default | UI, SSR, deploy Vercel                            |
| **React 19**                   | —                           | UI library                                        |
| **CSS Modules**                | `*.module.css`              | Styling scoped — **không Tailwind, không shadcn** |
| **Components tự viết**         | `apps/web/components/`      | Design system nội bộ                              |
| **Storybook**                  | `@storybook/nextjs`         | Stories cho từng component — dev UI độc lập       |
| **Zod**                        | import từ `@aucobot/shared` | Validate form                                     |
| **react-hook-form**            | `@hookform/resolvers/zod`   | Form UX                                           |
| **Zustand**                    | `stores/<domain>/`            | Buffer stream + projection server state — **không** business logic |
| **TanStack Query**             | `@tanstack/react-query`       | Optional: cache REST snapshot; job status chủ yếu qua WS |
| **Luxon** hoặc **date-fns-tz** | —                           | Timezone lịch đăng (`Asia/Ho_Chi_Minh`)           |

**Quy ước component:**

```text
components/Button/
  Button.tsx           # logic + JSX, import styles from './Button.module.css'
  Button.module.css    # class scoped
  Button.stories.tsx   # Storybook variants
  index.ts             # re-export
```

`app/` chỉ **compose** components — không nhét CSS/layout phức tạp trực tiếp trong page.

### Tech Stack — AI (`packages/llm-services`)

| Công nghệ                | Vai trò                                                    |
| ------------------------ | ---------------------------------------------------------- |
| **Vercel AI SDK** (`ai`) | Stream, tool calling, orchestration                        |
| **@ai-sdk/togetherai**   | Provider Together AI (Qwen / Llama)                        |
| **Zod**                  | `generateObject` — caption, schedule intent, learning JSON |

### Tech Stack — Shared (`packages/shared`)

| Công nghệ           | Vai trò                                                      |
| ------------------- | ------------------------------------------------------------ |
| **Zod**             | API schemas, form schemas, AI output schemas, env validation |
| **Types/constants** | `HealthResponse`, `UserResponse`, ports, …                   |

### Tech Stack — Social & queue

| Công nghệ               | Package              | Vai trò                       |
| ----------------------- | -------------------- | ----------------------------- |
| **Fetch / ky**          | `social-providers`   | Gọi Graph API, TikTok API     |
| **Zod**                 | parse response ngoài | Runtime safety                |
| **Vercel AI SDK tools** | `mcp-core`           | Tool calling bọc publish/read |

### Tech Stack — Storage & tài liệu (phase sau)

| Công nghệ                                | Vai trò                                         |
| ---------------------------------------- | ----------------------------------------------- |
| **Cloudflare R2** + `@aws-sdk/client-s3` | Upload PDF/ảnh                                  |
| **pdf-parse**, **mammoth**               | Extract text ngắn (< 30 trang → context window) |
| **pgvector** + EmbedJs                   | Defer — RAG tài liệu dài                        |

### Tech Stack — Observability & CI

| Công nghệ                                       | MVP                           |
| ----------------------------------------------- | ----------------------------- |
| **Sentry** (`@sentry/nestjs`, `@sentry/nextjs`) | Khuyến nghị sớm               |
| **Vitest**                                      | Unit test packages            |
| **Playwright**                                  | E2E trước launch              |
| **GitHub Actions**                              | `typecheck`, `build`, migrate |
| **Docker Compose**                              | Local PostgreSQL + Redis      |

### Defer (post-MVP)

| Công nghệ             | Lý do defer                            |
| --------------------- | -------------------------------------- |
| Clerk / Auth0         | Passport+JWT đủ kiểm soát token FB     |
| LangChain             | Nặng, trùng Vercel AI SDK              |
| Tailwind / shadcn     | Đã chốt CSS Modules + components riêng |
| Tách worker AWS       | Chưa có metric queue backlog           |
| Stripe, email service | Chưa billing                           |

---

### `packages/database`

Prisma schema (PostgreSQL) và export client.

**Models hiện có (✅):** `User`, `RefreshToken`, `EmailOtpChallenge`, `Conversation` (enum `ConversationType: room | session`).
**Models 💡 (thêm theo vòng):** `Message`, `Agent`, `Bot`, `BotTemplate`, `BotVersion`, `WorkflowRun`, `WorkflowStep`, `ConversationMember`, `Workspace`, `WorkspaceMember`, `AgentGrant`, `SocialAccount`, `Approval`, `ScheduledPost`, `AuditLog` — xem [Model DB tiến hóa](#model-db-tiến-hóa-hiện-tại--tương-lai).

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/index.ts
```

### `packages/shared`

**Zod schemas** (single source of truth), types, event contracts và constants dùng chung giữa `web`, `api`, `llm-services`.

Ví dụ schema planned: `CreateScheduledPostSchema`, `GenerateCaptionSchema`, `SessionUserSchema`, `UserResponseSchema`.

### `packages/social-providers`

Abstraction Facebook Graph API và TikTok Marketing API.

### `packages/mcp-core`

MCP tools — bọc `social-providers` cho Vercel AI SDK tool calling.

### `packages/llm-services`

Prompt + Together AI qua Vercel AI SDK, structured output (Zod).

## Sơ đồ phụ thuộc code

```
                    ┌─────────────┐
                    │    web      │  → Vercel
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   shared    │◄──────────────────────────┐
                    └──────┬──────┘                           │
                           │                                  │
              ┌────────────┼────────────┐                     │
              ▼            ▼            ▼                     │
       ┌────────────┐ ┌───────────┐ ┌──────────────┐          │
       │  database  │ │llm-services│ │social-providers│       │
       └─────┬──────┘ └─────┬─────┘ └───────┬──────┘          │
             │              │               │                  │
             └──────────────┼───────────────┘                  │
                            ▼                                  │
                     ┌─────────────┐                           │
                     │  mcp-core   │───────────────────────────┘
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ api         │  → Railway (+ Worker gộp)
                     └─────────────┘
```

## Biến môi trường

```env
# Database
DATABASE_URL="postgresql://..."

# Redis (khi có BullMQ)
REDIS_URL="redis://..."

# API server
API_PORT=4000
WEB_ORIGIN="http://localhost:3000"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:4000"

# AI (phase tiếp theo)
TOGETHER_API_KEY=

# Feature plugins (comma-separated)
ENABLED_FEATURES=facebook,tiktok,publishing,approvals,documents,ai-orchestration

# Web search (feature plugin)
TAVILY_API_KEY=

# Auth & session (NestJS Passport + JWT cookie)
JWT_SECRET=
JWT_EXPIRES_IN=7d
TOKEN_ENCRYPTION_KEY=          # 32 bytes hex — encrypt OAuth tokens in DB

# Facebook OAuth
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=

# TikTok OAuth (v1.1)
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

## Scripts gốc (root)

| Lệnh              | Mô tả                         |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Dev mode toàn monorepo        |
| `pnpm dev:web`    | Next.js :3000                 |
| `pnpm dev:api`    | NestJS :4000                  |
| `pnpm storybook`  | Storybook UI components (web) |
| `pnpm build`      | Build toàn monorepo           |
| `pnpm typecheck`  | Kiểm tra types                |
| `pnpm db:migrate` | Prisma migrate dev            |
| `pnpm db:push`    | Prisma db push                |
| `pnpm db:studio`  | Prisma Studio                 |

## Trạng thái hiện tại

| Hạng mục | Trạng thái |
| --------------------------------------------------- | ------------------------------- |
| Monorepo + Turborepo | ✅ |
| PostgreSQL + Prisma (User, auth OTP) | ✅ |
| NestJS auth: OTP + Google + JWT cookie | ✅ |
| NestJS health | ✅ |
| Redis OTP rate limit | ✅ |
| Next.js: subdomain + `/app` shell, landing, login | ✅ |
| Hash routing (`#conversationId`) | ✅ |
| **Chat Phase 1: Room + Session CRUD + UI tạo phòng** | ✅ |
| Chiến lược mở rộng (tenancy, ID, tách DB) | ✅ doc; 💡 implement theo vòng |
| Docker API image + Railway deploy | ✅ |
| Key quảng cáo: **「Xây dựng Phòng Marketing Ảo」** | ✅ (marketing); Room = tên kỹ thuật |
| Kiến trúc **core + features (plugin)** | ✅ doc; 💡 implement dần |
| Giao thức **REST + WebSocket** | ✅ chốt; 💡 WS gateway |
| Agent preset, MCP, approval, publish | 💡 (user agents + Room; Session dùng Quick Assistant) |
| BullMQ worker | 💡 |
| Frontend `STRUCTURE.md` + ESLint | ✅ |
| Frontend CSS Modules + Storybook | 💡 |
| Tách worker service riêng | ⏸️ Defer post-MVP |
