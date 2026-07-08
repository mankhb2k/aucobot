# `agents/` — Agent domain (system + user)

> **💡 Planned** — chưa implement. Giữ cấu trúc thư mục; triển khai sau `conversations` CRUD ổn định.

## Vai trò

Module **domain Agent** — định nghĩa trợ lý AI, compile prompt, resolve ai trả lời tin nhắn, expose CRUD danh bạ agent của user.

| Trách nhiệm | Ghi chú |
|-------------|---------|
| **CRUD** user agent | Wizard / Mother → `POST /api/agents` — user **ký**, không auto-insert |
| **System agents** | Platform ship sẵn — seed/provision lúc boot hoặc signup |
| **Prompt compiler** | `CreateAgentDto` → `instructionsCompiled` (user không sửa raw markdown) |
| **AgentResolver** | Session → Quick Assistant; Room → mention / `@Trợ Lý` orchestrator |
| **Capability manifest** | Mô tả skillGroups agent có — orchestrator dùng để dispatch |
| **Tool allowlist** | Đọc MCP tools từ [`plugins/`](../plugins/README.md) theo `enabledSkillGroups` |

**Không làm ở đây:** stream LLM (`features/ai-orchestration/`), WebSocket (`realtime/`), hội thoại CRUD (`conversations/`).

## Hai loại agent

| Loại | `ownerId` | Ví dụ | Dùng ở đâu |
|------|-----------|-------|------------|
| **System** | `null` · `isSystem: true` | Quick Assistant, `@Trợ Lý`, Mother | Session / Room / onboarding |
| **User** | `userId` | Mai Content, CS Bot, … | **Room** — user add từ danh bạ |

### System agents (ship sẵn)

| Agent | `presetId` | Vai trò |
|-------|------------|---------|
| **Quick Assistant** | `quick-assistant` | Gắn **mọi Session** — việc nhanh, scratch, không tag vẫn trả lời |
| **@Trợ Lý** | `orchestrator` | Auto-provision **mọi Room** — dispatch agent user theo mention/manifest |
| **Mother** | `mother` | Session onboarding — **chỉ đẻ** user agent (BotFather-style); không đẻ Bot |

User **không** add user-agent vào Session — API reject; Session luôn route tới Quick Assistant.

### User agents

- Tạo qua **Mother** (chat wizard) → user bấm Tạo → `POST /api/agents`
- Thuộc danh bạ user — tái sử dụng nhiều Room
- **Không** tự vào Session

## Quan hệ module

```text
conversations/          Room + Session, members, access.assert
        ↓ gọi
agents/                 resolve agent + compile prompt + CRUD
        ↓ đọc tools
plugins/                MCP registry (feature bật qua ENABLED_FEATURES)
        ↑
features/*              Facebook, web-search, ai-orchestration, …
```

**Luồng chat (planned):**

```text
POST /api/conversations/:id/messages
  → ConversationAccessService.assert(userId, conversationId)
  → AgentResolver.resolve(conversation, mention?, replyTo?)
  → PromptAssembler.build(instructionsCompiled + history + RAG 💡)
  → llm-services stream + tools từ registry
  → Message persist + WSS push
```

### Routing theo `Conversation.type`

| `type` | Resolve |
|--------|---------|
| `session` | Luôn **Quick Assistant** (system) — không mention |
| `room` | Không tag → **không ai** · `@Trợ Lý` → orchestrator · `@Mai` → thẳng agent · reply-to → agent đó |

## API contract (draft)

### User agents

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/agents` | Danh sách agent của user (không gồm system template 💡) |
| POST | `/api/agents` | Tạo agent (wizard payload — Mother soạn, user ký) |
| GET | `/api/agents/:id` | Chi tiết |
| PATCH | `/api/agents/:id` | Sửa → recompile `instructionsCompiled` |
| DELETE | `/api/agents/:id` | Xóa (soft delete 💡) |

### Catalog (wizard)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/skill-groups` | Nhóm kỹ năng + OAuth connected |
| GET | `/api/roles` | Role preset + `custom` |

Members gắn agent ↔ conversation: **`conversations/`** — `POST /api/conversations/:id/members`.

## Cấu trúc thư mục (planned)

Theo [`.agent/rule.md`](../../.agent/rule.md) — mỗi service một folder con:

```text
agents/
  agents.controller.ts
  agents.module.ts
  dto/
  service/
    agents/
      agents.service.ts
      agents.service.test.ts
    agent-resolver/
      agent-resolver.service.ts
      agent-resolver.service.test.ts
    prompt-compiler/
      prompt-compiler.service.ts
      prompt-compiler.service.test.ts
    system-agents/
      system-agents.service.ts      # seed Quick Assistant, @Trợ Lý, Mother
      system-agents.service.test.ts
```

## Model dữ liệu (draft)

Xem [`agent-plan.md`](../../../../agent-plan.md) — tóm tắt:

```text
Agent
  ownerId?              null = system agent
  isSystem              Quick Assistant | @Trợ Lý | Mother
  presetId              quick-assistant | orchestrator | mother | custom
  name, avatarUrl, bio, tonePreset, role, description
  instructionsCompiled  system prompt đã compile
  enabledSkillGroups    CSV nhóm MCP

ConversationMember      💡 conversations/ provision khi tạo session/room
  agentId, isDefault    session → Quick Assistant (isDefault: true)
```

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| User agent `ownerId === userId` | System agent có `ownerId` user |
| Resolver tập trung — một chỗ chọn agent | Rải routing logic trong controller message |
| Tools chỉ qua `plugins/` registry | Import trực tiếp `features/facebook` |
| Recompile prompt khi PATCH agent | Expose `instructionsSource` raw cho client sửa tùy ý |
| Test mỗi `*.service.ts` | Hit DB/LLM thật trong unit test |

## Thứ tự implement đề xuất

```text
1. Prisma Agent + ConversationMember
2. system-agents/ seed Quick Assistant + @Trợ Lý
3. agents/ CRUD + prompt-compiler
4. conversations/ auto-bind member khi POST session | room
5. agent-resolver/ (trước messages API)
6. Mother flow + POST /api/agents
```

## Tham chiếu

- [`agent-plan.md`](../../../../agent-plan.md) — Phase A, schema, API draft
- [`aucobot-architecture.md`](../../../../aucobot-architecture.md) — Room orchestrator, star topology
- [`conversations/README.md`](../conversations/README.md) — Session vs Room, access checkpoint
- [`plugins/README.md`](../plugins/README.md) — MCP tool registry
