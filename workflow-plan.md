# Aucobot — Workflow (Block/Bot) Plan

> Kiến trúc **Block/Bot Workflow** — đối chiếu [`aucobot-architecture.md`](./aucobot-architecture.md) (mục *Bot Workflow*) với source thật của [n8n](https://github.com/n8n-io/n8n) (clone tham khảo tại `./n8n`, **không import vào code**).
> Bổ sung cho `aucobot-architecture.md` + [`agent-plan.md`](./agent-plan.md); không thay thế.

### Ký hiệu trạng thái

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **✅ Đã chốt** | Quyết định rõ, có thể implement |
| **🔜 Đề xuất** | Khuyến nghị — chưa chốt, cần duyệt |
| **💡 Mở** | Câu hỏi/hạng mục để ngỏ, cần quyết định trước khi code |
| **❌ Không làm** | Đã cân nhắc, loại bỏ, kèm lý do |

---

## 0. Nguyên tắc tối cao ✅

> **MVP hướng dân marketing (non-tech, no-code); tương lai mở thêm dân code và dân văn phòng/kế toán (hiểu chút ít form/API/JSON).** Catalog dùng chung 1 bộ cho mọi audience, chỉ khác Agent gợi ý Block nào cho ai.

- **AI Agent chỉ hỗ trợ công việc chân tay** (ghép Block, sinh glue, chạy tool) theo **ý tưởng do user đưa ra** — **Agent không có quyền quyết định**. Người ra quyết định cuối luôn là **con người**.
- **User PHẢI thấy diagram các khối Block trên UI trực quan** trong lúc Agent dựng Bot — không phải hộp đen chỉ tóm tắt bằng lời.
- Tách 2 tầng: **(a) cấu hình** (điền tham số, viết glue) — do Agent làm, user không đụng form; **(b) hiển thị/duyệt** (xem cấu trúc, xem kết quả, bấm duyệt/từ chối) — **bắt buộc trực quan cho user**.
- n8n tối ưu cho người **tự vẽ** workflow (canvas, properties panel). Aucobot tối ưu cho người **không tự vẽ nhưng vẫn cần thấy** — gần với "xem bản vẽ kiến trúc sư đưa ra" hơn là "tự dùng CAD". Không cần properties panel cấu hình tham số, nhưng cần renderer hiển thị diagram.
- Lỗi phải **dịch được sang tiếng người** — non-tech không đọc được stack trace.

Nguyên tắc này **override** mọi đề xuất bên dưới nếu xung đột.

---

## 1. Bối cảnh

Aucobot đã thiết kế (💡 ý tưởng, chưa chốt, tự ghi trong `aucobot-architecture.md`) hệ **Block/Bot**:

- **Block** = khối Lego 1-việc, hệ thống cung cấp (vetted catalog): `Trigger`, `Extraction`, `Processing`, `Action`.
- **Bot** = Agent ghép nhiều Block + glue JS → automation chạy nền (`schedule` / `event` / `agent-invoked`).
- **BotTemplate** hướng dẫn Agent sinh glue đúng khung; **BotVersion** là artifact bất biến, rollback = đổi con trỏ.
- Compile-time (Agent, đắt, 1 lần) tách khỏi runtime (Bot, rẻ, lặp vô hạn, không LLM).

Nguồn n8n đã đọc: `packages/workflow/src/interfaces.ts`, `packages/workflow/src/common/` (graph utilities), `packages/core/src/execution-engine/workflow-execute.ts`, node mẫu `{Code,Cron,Webhook,If,Set,HttpRequest}`, `packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow`.

---

## 2. Không bê nguyên n8n ✅

| Lý do | Chi tiết |
|-------|----------|
| Lệch mental model | n8n = canvas cho **người** thiết kế trực quan. Aucobot = Agent dựng theo ý user, không ai tự vẽ từ đầu. |
| Quá tổng quát | n8n 400+ node cho mọi ngành. Aucobot cần **vertical** — 15-20 Block đủ (80/20 rule). |
| Sai stack | n8n: Express + TypeORM + Vue 3 (verify `packages/cli/package.json` — không `@nestjs/*`). Aucobot: NestJS + Next.js + Prisma + Zod. |
| Rủi ro license | Sustainable Use License — học pattern, không copy code. |
| Không tách được | `workflow-execute.ts` phụ thuộc trực tiếp `NodeExecuteFunctions` (binary data, credential decrypt, expression evaluator riêng) — embed = phải mang gần hết `packages/core`. |

**Loại khỏi roadmap:** adapter tương thích n8n community node. 95% community node dùng expression `{{ }}` + helper runtime riêng của n8n — "adapter" thực chất phải viết lại phần lớn `packages/core`, chi phí ngang embed nguyên n8n.

---

## 3. Pattern áp dụng từ n8n (đã fact-check source)

| # | Pattern n8n | Nguồn | Map vào Aucobot | Điều chỉnh non-tech |
|---|-------------|-------|------------------|----------------------|
| 1 | Node = `description` + hàm thực thi | `Code.node.ts`, `Cron.node.ts` | `BlockDefinition = { inputSchema, outputSchema, execute() }` | Bỏ `properties` (form cấu hình), giữ field hiển thị diagram (mục 5) |
| 2 | `builderHint` cho AI tự chọn node | `Code.node.ts` | `agentHint` | Field bắt buộc, giàu ví dụ — quan trọng nhất cả interface (mục 6.1) |
| 3 | Item-based data + `pairedItem` lineage | `interfaces.ts` | `WorkflowStep.output` dạng `items[]` có lineage id | Giữ — cần cho debug |
| 4 | Node versioned (`V1/V2` subfolder) | `If.node.ts`, `HttpRequest.node.ts` | `Block.version` — pin bản cũ khi breaking | Im lặng hoàn toàn với user, tự re-generate qua self-healing (mục 6.4) |
| 5 | Declarative node cho REST đơn giản | pattern routing `HttpRequest` | Track "declarative Action Block" | Giữ — giảm code khi thêm platform mới |
| 6 | Code node chạy Task Runner **process riêng** | `JsTaskRunnerSandbox` | Xác nhận hướng "execution plane riêng" đã có trong architecture doc đúng | Giữ |
| 7 | Credential tách khỏi node logic (`extends`, `authenticate`, `test`, `supportedNodes`) | `ICredentialType` (`interfaces.ts` dòng 374-406) | `BlockExecutionContext.getCredential()` | `authenticate` hợp cho declarative Action Block, không cần áp mọi Block |
| 8 | Graph traversal (`getChildNodes`, `getParentNodes`, `mapConnectionsByDestination`) | `packages/workflow/src/common/` | Cần khi Bot có nhiều nhánh thật | Gotcha: n8n's `connections` index theo **source node** — invert bằng `mapConnectionsByDestination()` để tìm parent. Chốt rõ chiều index từ đầu nếu tự viết |
| 9 | AI Agent gọi sub-workflow như tool | `ToolWorkflow.node.ts` | Đúng pattern cho `trigger.agent-invoked` | Không dùng `ManualTrigger` (nút debug editor, không phải production trigger) |
| 10 | 3 lớp lỗi theo nguyên nhân (`UserError`/`OperationalError`/`UnexpectedError`) | n8n `AGENTS.md` | Bổ sung mới (mục 6.3) | Cần **hơn cả n8n** — phải dịch lỗi sang tiếng người cho non-tech |

---

## 4. Pattern KHÔNG áp dụng

| Pattern n8n | Lý do loại |
|-------------|------------|
| `properties` UI-schema cấu hình tham số (`displayOptions`, `typeOptions`...) | Chỉ phục vụ form điền tham số cho người — Agent điền glue bằng code. Không nhầm với hiển thị *cấu trúc* trên diagram (vẫn cần, mục 5) |
| Named multi-output ports **ở tầng thực thi** (IF/Switch dùng N cổng thật) | Agent viết glue `if (result.branch === 'reject') return;` dễ và ít lỗi hơn cho LLM so với multi-port wiring. Dùng discriminant field (mục 6.2) — tầng **hiển thị** vẫn vẽ đa nhánh |
| Canvas kéo-thả **tự do** (user tự vẽ từ đầu) | Agent vẫn là người dựng chính theo ý user — không bắt non-tech tự đặt node từ trắng. Khác với "diagram hiển thị + chỉnh nhẹ" (vẫn cần) |
| 400+ integration node | 15-20 Block vertical đủ |
| Expression engine `{{ $json.x }}` | Zod + JS glue do Agent sinh đơn giản hơn |
| Credential system generic (OAuth2 hooks đa dịch vụ) | Đã có `social_accounts` + AES-256-GCM riêng |
| "Manual Trigger" làm khái niệm hiển thị | Chỉ nội bộ (`trigger.agent-invoked`) — không lộ ra copy/UI |
| Adapter tương thích n8n community node | Xem mục 2 |

---

## 5. Block interface

```typescript
// packages/block-core/src/block.interface.ts
import { z } from 'zod';

export type BlockGroup = 'trigger' | 'extraction' | 'processing' | 'action';

export interface BlockDefinition<TIn = unknown, TOut = unknown> {
  id: string;                 // 'trigger.cron', 'action.social.fb-publish'
  version: number;            // pin bản cũ khi breaking — im lặng với user (mục 6.4)
  group: BlockGroup;

  // Render node trên diagram trực quan (mục 0) — KHÔNG phải form cấu hình tham số
  displayName: string;        // tên hiển thị, tiếng Việt tự nhiên
  icon?: string;               // icon/emoji — non-tech quét nhanh cấu trúc
  shortSummary: string;        // 1 câu mô tả, hiện dưới tên trên diagram

  inputSchema: z.ZodType<TIn>;
  outputSchema: z.ZodType<TOut>;   // rẽ nhánh dùng discriminant field, KHÔNG multi-port

  // Field quan trọng nhất — quyết định Agent chọn đúng Block hay không (mục 6.1)
  agentHint: {
    whenToUse: string;
    whenNotToUse: string;                 // bắt buộc, không optional
    commonMistakes: string[];
    exampleInputOutput: Array<{ input: TIn; output: TOut }>;  // few-shot ngay trong catalog
    relatedBlocks?: Array<{ id: string; reason: string }>;
  };

  requiredCredentials?: string[];   // 'facebook-oauth' | 'tiktok-oauth' — Block không tự giữ secret

  execute(ctx: BlockExecutionContext<TIn>): Promise<TOut>;
}

export interface BlockExecutionContext<TIn> {
  input: TIn;
  ownerId: string;
  runId: string;
  getCredential<T>(type: string): Promise<T>;
  logger: BlockLogger;
  signal: AbortSignal;             // guardrail: timeout / cancel
}
```

### 5.1 Track riêng cho Action Block declarative (REST + OAuth đơn giản)

```typescript
export interface DeclarativeHttpBlock {
  kind: 'declarative-http';
  request: (input: unknown) => {
    method: string;
    url: string;
    body?: unknown;
    headers?: Record<string, string>;
  };
  mapResponse?: (raw: unknown) => unknown;
}
```

---

## 6. Bổ sung riêng cho Aucobot (n8n không cần)

### 6.1 `agentHint` là trọng tâm

LLM phải chọn đúng Block **zero-shot** — non-tech user không biết Block nào tồn tại để gợi ý lại nếu Agent chọn sai. Đầu tư viết `agentHint` (đặc biệt `exampleInputOutput` few-shot) quan trọng hơn cả tối ưu logic `execute()`.

### 6.2 Rẽ nhánh: thực thi bằng discriminant field, hiển thị bằng đa nhánh

```typescript
// Tầng THỰC THI — Agent viết glue rẽ nhánh bằng `if`
const FilterOutputSchema = z.discriminatedUnion('branch', [
  z.object({ branch: z.literal('pass'), data: z.unknown() }),
  z.object({ branch: z.literal('reject'), reason: z.string() }),
]);
```

Tầng **hiển thị** (diagram) vẫn vẽ 2 nhánh riêng ra khỏi node `process.filter-condition` — non-tech user cần thấy rõ *"đạt thì đi đường này, không đạt thì đi đường khác"*. Renderer đọc `outputSchema` (discriminatedUnion) để tự suy ra số nhánh cần vẽ — không cần engine thực thi multi-port thật.

### 6.3 Ba tầng lỗi — dịch sang tiếng người

| Loại lỗi | Ý nghĩa | Agent xử lý |
|---|---|---|
| `BlockUserError` | Thiếu điều kiện phía user (chưa kết nối FB, hết quota) | Dịch thẳng: *"Mình chưa đăng được vì Facebook chưa kết nối. Bạn kết nối giúp mình nhé?"* |
| `BlockOperationalError` | Lỗi tạm thời (rate limit, timeout mạng) | Tự retry ngầm, không báo user trừ khi hết lần retry |
| `BlockUnexpectedError` | Bug thật trong Block | Báo chung, không lộ chi tiết kỹ thuật; audit log riêng cho dev |

### 6.4 Versioning — im lặng, không có UI "nâng cấp node"

Khi Block nâng version breaking: Bot đang chạy **tự động pin bản cũ**. "Nâng cấp" xảy ra qua cơ chế **self-healing** đã có trong `aucobot-architecture.md` (output lệch schema → Agent re-generate glue → `BotVersion` mới → dry-run + user duyệt) — không cần thêm cơ chế mới.

### 6.5 Luồng UX — Agent hỗ trợ dựng theo ý user, luôn hiện diagram để duyệt

```text
User: "Mỗi sáng cho tôi biết hôm qua page có bao nhiêu tương tác"
  → Agent nhận diện: nhu cầu lặp lại → cần Automation
  → Agent soạn nháp từ BotTemplate (schedule → fetch stat → llm-transform → notification)
  → Trả lời tự nhiên + HIỂN THỊ DIAGRAM (node nối tiếp, icon + tên dễ hiểu):
     "Mình dựng thử automation này theo ý bạn, xem cấu trúc bên dưới nhé →"
     [diagram: 🕗 Chạy 8h sáng → 🤖 Tóm tắt bằng AI → 💬 Gửi vào phòng]
     + dry-run ngay, hiện output mẫu cạnh diagram
  → User xem diagram + kết quả mẫu → "ok đúng rồi" (hoặc yêu cầu chỉnh)
  → Agent CHỜ user xác nhận rõ ràng mới lưu BotVersion active — không tự bật ngầm
  → Xuất hiện trong "Automations": tên tiếng Việt + diagram thu nhỏ + mô tả 1 câu +
     lịch chạy + on/off + nút "Sửa"
```

"Sửa" = mở lại diagram + chat với Agent. User gõ tự nhiên hoặc chỉnh nhẹ trực tiếp trên diagram (bật/tắt Block, đổi thứ tự — mục 10 #6) → Agent tạo `BotVersion` mới, vẫn hiện diagram để duyệt lại.

### 6.6 Thứ tự ra mắt Bot theo độ tin tưởng (không theo độ khó kỹ thuật)

| Thứ tự | Bot ví dụ | Vì sao đi trước | Rủi ro |
|---|---|---|---|
| **1** | Báo cáo định kỳ trong phòng (`cron → llm-transform → notification`) | Không OAuth, không side-effect ra ngoài | Rất thấp |
| **2** | Soạn draft caption (không tự đăng) | Vẫn không side-effect, chạm LLM sinh content | Thấp |
| **3** | Đăng bài đã qua Approval queue | Có OAuth + side-effect thật, có bước duyệt chặn | Trung bình |
| **4** | Tự động trả lời comment / social monitor | Side-effect công khai, real-time, khó undo | Cao — để sau cùng |

Thứ tự **ra mắt sản phẩm**, có thể khác thứ tự **code Block** (mục 7) — có thể code sẵn `action.social-publish` sớm về kỹ thuật nhưng chỉ mở khoá cho user sau khi Bot #1–#2 chạy ổn định.

### 6.7 Nguyên tắc catalog: generic-first, cứng hoá chỉ vì rủi ro

Phần lớn catalog nên là **primitive linh hoạt** (generic, tham số hoá mạnh — đặc biệt `llm-transform` dùng prompt tự nhiên, tạo vô số use case từ 1 block). **Chỉ cứng hoá thành block chuyên biệt khi rơi vào 1 trong 2 lý do rủi ro**, không phải vì "làm cho gọn":

| Lý do bắt buộc cứng hoá | Vì sao generic không đủ an toàn |
|---|---|
| **OAuth + side-effect công khai ra ngoài** | Credential cần scope cứng vào đúng endpoint (n8n: `ICredentialType.supportedNodes` + `restrictToSupportedNodes`). Generic `http-request` + gắn token FB = token có thể gọi nhầm endpoint. Rate-limit/content-policy phải hard-code ở tầng executor, không generic hoá được |
| **Hậu quả pháp lý/tài chính** | Non-tech/semi-tech user không tự verify được glue Agent sinh ra có đúng nghiệp vụ không (vd. công thức thuế) — cần block đã test kỹ |

Ngoài 2 lý do trên — generic hoá tối đa, không tạo block riêng cho từng use case kiểu n8n.

**Mở rộng audience:** dùng chung 1 catalog cho marketing (MVP) → office/kế toán → dev-tier (tương lai), chỉ khác Agent gợi ý Block nào cho ai. **Catalog vẫn đóng/vetted với mọi audience** — dev-tier chỉ mở khoá primitive mạnh hơn *đã có sẵn* (`process.code`, `http-fetch` full method), không được tự đăng ký Block type mới.

**Không có "Approval Block" riêng** — dùng flag `requiresApproval: boolean` gắn trên Action Block bất kỳ. `control.wait-for-approval` (giữa Bot đang chạy) và Approval queue hiện có (output cuối trước publish) là 2 cơ chế bổ trợ, không trùng.

---

## 7. Block catalog

| Block | Nhóm | Vai trò | n8n tham khảo | MVP? | Audience / rollout |
|---|---|---|---|---|---|
| `trigger.cron` | Trigger | Lịch chạy | `Cron.node.ts` | ✅ MVP | Tất cả — #1 |
| `trigger.agent-invoked` | Trigger | Agent gọi khi user giao việc | `ToolWorkflow.node.ts` | ✅ MVP | Tất cả — #1 |
| `trigger.webhook` | Trigger | Nhận event từ ngoài | `Webhook.node.ts` | 🔜 sau MVP | Dev-tier — #3+ |
| `extract.http-fetch` | Extraction | Gọi API đọc dữ liệu (GET only ở MVP) | pattern routing `HttpRequest.node.ts` | 🔜 sau MVP | Tất cả (GET) → dev-tier (full method) |
| `extract.social-monitor` | Extraction | Poll comment/mention | `triggers-and-pollers.ts` | 💡 defer | Marketing — #4, rủi ro cao |
| `extract.invoice-ocr` | Extraction | Đọc số liệu hoá đơn/ảnh scan | — | 💡 tương lai xa | Kế toán, cần model OCR riêng |
| `process.llm-transform` | Processing | Sinh/tóm tắt/phân loại — prompt tự nhiên | `AiTransform` | ✅ MVP | Tất cả — #1, block "sáng tạo" nhất |
| `process.data-mapper` | Processing | Map/rename/pick/merge field N→N+1 | `Set.node.ts` | ✅ MVP | Tất cả |
| `process.filter-condition` | Processing | Rẽ nhánh theo điều kiện (mục 6.2) | `If.node.ts` (chỉ học logic, không multi-port) | 🔜 sau MVP | Tất cả — #2+ |
| `process.formula` | Processing | Công thức tính toán an toàn — expression evaluator, KHÔNG code JS | — | 💡 tương lai | Office/kế toán |
| `process.code` | Processing | JS sandbox — escape hatch khi thiếu block | `Code.node.ts` + `JsTaskRunnerSandbox` | ✅ MVP (nội bộ) | Chỉ dev-tier |
| `control.wait-for-approval` | Control | Dừng Bot giữa chừng chờ người quyết định | — | 🔜 nên có sớm | Tất cả — hiện thực hoá "Agent không quyết định" |
| `control.loop` | Control | Lặp qua từng item trong danh sách | — | 💡 tương lai | Dev-tier |
| `action.notification` | Action | Gửi thông báo (Telegram/email/in-room) | pattern Telegram/Slack | ✅ MVP | Tất cả — #1 |
| `action.social-publish` | Action | Đăng FB/TikTok — credential scoped, rate-limit + content-policy cứng | declarative + OAuth | 💡 khi có `social_accounts` thật | Marketing — #3 |
| `action.spreadsheet-sync` | Action | Đọc/ghi Google Sheets | — | 💡 tương lai | Office/kế toán — "sống" trong sheet |
| `action.database-query` / `-write` | Action | Đọc/ghi DB nội bộ | Postgres/MySql node | 💡 tương lai | Office/dev — rủi ro SQL injection nếu Agent tự sinh query |
| `action.http-webhook-out` | Action | Gửi data ra 1 URL (POST) | — | 💡 tương lai | Chỉ dev-tier |

**Luồng demo MVP:** `trigger.cron` → `process.llm-transform` → `action.notification` — đúng luôn Bot #1 mở khoá cho user thật (mục 6.6), kỹ thuật và go-to-market khớp nhau ở bước đầu.

---

## 8. Merge vào `aucobot-architecture.md`

**Đã merge:** vai trò AI Agent hỗ trợ/không quyết định (bảng *Agent vs Bot*); diagram trực quan bắt buộc (đầu mục *Bot Workflow* + sơ đồ compiler); "Thư viện Block định sẵn" — Agent hỗ trợ lắp, không tự kích hoạt.

**Còn cần merge (không gấp):** bỏ ví dụ "Manual Trigger" dùng đúng enum `agent-invoked`; mục "Contract giữa Block" ghi rõ discriminant field (thực thi) vs đa nhánh (hiển thị); thêm bảng "Thứ tự ra mắt Bot theo độ tin tưởng" (mục 6.6 doc này).

---

## 9. Lộ trình implement

```text
Sprint 1 — Khung Block
  packages/block-core/  BlockDefinition (mục 5) + registry + executor guardrail nhẹ
  3 loại lỗi (mục 6.3): BlockUserError / BlockOperationalError / BlockUnexpectedError
  Guardrail MVP: timeout + no dynamic import (CHƯA cần Vercel Sandbox riêng)

Sprint 2 — 3 Block mẫu, agentHint đầu tư kỹ
  trigger.cron · process.llm-transform (dùng packages/llm-services) · action.notification
  Mỗi Block viết agentHint đủ whenNotToUse + ít nhất 2 exampleInputOutput

Sprint 3 — Bot ghép Block + luồng đề xuất chủ động (mục 6.5)
  BotTemplate + BotVersion
  Agent nhận diện nhu cầu lặp lại → tự đề xuất, dry-run, chờ user duyệt kết quả
  KHÔNG có UI tạo Bot bằng form — chỉ qua chat + diagram

Sprint 4 — Automation list + diagram UI
  Diagram: tên tự nhiên, mô tả 1 câu, lịch chạy, on/off, nút "Sửa"
  Tương tác mức (b): chỉnh nhẹ (bật/tắt Block, đổi thứ tự), không tự thêm Block mới

Sprint 5+ — Mở rộng theo thứ tự tin tưởng (mục 6.6)
  #2 process.filter-condition, soạn draft không tự đăng
  #3 action.social-publish (khi có social_accounts + Approval queue thật)
  #4 extract.social-monitor
  Nâng cấp guardrail → Vercel Sandbox/container riêng KHI có traffic thật
```

---

## 10. Block Discovery — Agent đọc catalog thế nào lúc lắp Bot ✅

Không làm y hệt giao thức MCP (đó là cho server *ngoài process*; Block catalog nằm *cùng process*). Lấy đúng **tinh thần discovery 2 lớp**, tái dùng nguyên pattern đã có trong `agent-plan.md` mục A.3b (routing skill trong Room: `skillGroups` LỌC cứng + `description` CHỌN mềm):

```text
Lớp 1 — list_blocks() → BẢN NHẸ: { id, group, displayName, shortSummary }
  Agent lọc theo group cần cho mục tiêu user (KHÔNG kèm inputSchema/outputSchema/agentHint đầy đủ)

Lớp 2 — describe_blocks(ids[]) → BATCH, BẢN ĐẦY ĐỦ cho đúng id đã chọn ở Lớp 1
  Trả inputSchema, outputSchema, agentHint.exampleInputOutput — đủ để sinh glue chính xác
  1 round-trip duy nhất, KHÔNG gọi lẻ từng block
```

**Vì sao không inject hết catalog vào mọi lượt chat:** `agentHint` giàu ví dụ khá dài — đáng dài để Agent chọn đúng, nhưng 95% lượt chat Room/Session không liên quan tới lắp Bot.

**Tách khỏi tool-loop của Agent hội thoại chính:** `list_blocks`/`describe_blocks` không phải tool luôn sẵn có cho Mai/@Trợ Lý. Agent hội thoại chỉ cần 1 tool cổng vào duy nhất — `propose_automation(goal: string)` — nội bộ tool này kích hoạt 1 **quy trình compile-time riêng** (tạm gọi **BotArchitect** — process nội bộ, không phải agent user thấy trong danh bạ, không dùng chung với Mother vì "Bot không qua Mother" đã chốt): `list_blocks` → chọn candidate → `describe_blocks` batch → sinh glue → dry-run → trả `{ diagramData, summary, sampleOutput }` cho Agent hội thoại hiển thị theo luồng mục 6.5.

Lợi ích: Agent hội thoại luôn nhẹ; quy trình lắp Bot được đầu tư reasoning kỹ hơn (chạy ít lần, không áp lực latency real-time).

---

## 11. Câu hỏi mở

| # | Câu hỏi | Trạng thái |
|---|---------|------------|
| 1 | `process.llm-transform` gọi LLM qua đâu? | ✅ Chốt — `packages/llm-services` (Vercel AI SDK + Together AI), không tạo track thứ 2 |
| 2 | Agent đọc catalog Block lúc lắp Bot? | ✅ Chốt — discovery 2 lớp, tách khỏi tool-loop chính qua `propose_automation` (mục 10) |
| 3 | Mức độ tương tác trên diagram? | ✅ Chốt **(b)** — xem + chỉnh nhẹ (bật/tắt, đổi thứ tự, không tự thêm Block mới) |
| 4 | Ai duyệt Block mới thêm vào catalog vetted? | 💡 mở — gợi ý: MVP chỉ dev team qua code review; sau: quy trình từ tín hiệu roadmap self-healing (mục 6.4) |
| 5 | Execution cho JS glue Agent sinh — eval-guard hay Sandbox ngay? | 💡 mở — gợi ý: eval trong worker + guardrail nhẹ tới khi có ≥1 Bot thật chạy ổn định |
| 6 | Bot #1 (báo cáo định kỳ) có cần OAuth Facebook thật, hay chỉ tóm tắt hoạt động room? | 💡 mở — gợi ý: bắt đầu **không cần OAuth**, giữ nguyên tắc "rủi ro thấp nhất trước" |
| 7 | Công cụ render diagram — lib có sẵn (React Flow) hay tự viết component nhẹ? | 💡 mở — gợi ý: đã chốt (b) ở câu 3 (không full kéo-thả) → tự viết component nhẹ, khớp convention "Components tự viết + CSS Modules" |
| 8 | Audience/trust-tier để gate Block nào Agent được gợi ý? | 💡 mở — đề xuất mục 6.7: có, dùng chung 1 catalog, không cho user tự đăng ký Block mới |

---

## 12. Tham chiếu nội bộ

| Doc | Nội dung liên quan |
|-----|---------------------|
| [`aucobot-architecture.md`](./aucobot-architecture.md#bot-workflow--thiết-kế-mở-rộng-tham-khảo-khi-scale) | Model gốc `Block`/`Bot`/`BotTemplate`/`BotVersion`, 4 nhóm Lego, phân tầng rủi ro pháp lý |
| [`agent-plan.md`](./agent-plan.md#c2-automation--bot-ghép-block-không-agent) | Quy tắc Agent vs Bot, "Mother chỉ đẻ Agent", Automation đứng nền, capability manifest 2 lớp (mục A.3b) |
| `./n8n` (clone local, không import) | `packages/workflow/src/interfaces.ts`, `packages/workflow/src/common/`, `packages/core/src/execution-engine/workflow-execute.ts`, `packages/nodes-base/nodes/{Code,Cron,If,Set,HttpRequest,AiTransform}`, `packages/@n8n/nodes-langchain/nodes/tools/ToolWorkflow` |

---

## 13. Tóm tắt

**Không bê nguyên n8n.** Học 10 pattern cụ thể, lọc qua lăng kính non-tech: bỏ form cấu hình tham số và multi-port ở tầng thực thi, nhưng giữ/nâng tầng hiển thị — **AI Agent chỉ hỗ trợ dựng theo ý user, không có quyền quyết định; user PHẢI thấy diagram Block trực quan** và tự tay duyệt trước khi Bot kích hoạt. Catalog **generic-first** — chỉ cứng hoá vì rủi ro OAuth/pháp lý, không vì tiện lợi; dùng chung 1 bộ Block cho marketing (MVP) → office/kế toán → dev-tier (tương lai). Bắt đầu bằng 3 Block tối giản (`cron` → `llm-transform` → `notification`) + component diagram nhẹ, không cần OAuth thật, không cần sandbox riêng, không cần canvas kéo-thả nặng như n8n.
