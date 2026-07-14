# `agents/` — Agent domain (system + user)

Module **domain Agent** — định nghĩa trợ lý AI, compile prompt, resolve agent trả lời tin nhắn, expose CRUD danh bạ agent của user.

| Trách nhiệm | Trạng thái |
|-------------|------------|
| **CRUD** user agent | `GET/POST /api/agents`, `GET /api/agents/:id` |
| **System agents** | Seed boot: Quick Assistant, `@Trợ Lý`, Mother |
| **Prompt compiler** | Wizard payload → `instructionsCompiled` |
| **AgentResolver** | Session → Quick Assistant (Room routing 🔜) |
| **Capability / tools** | 🔜 skill-groups + MCP allowlist |

**Không làm ở đây:** stream LLM (`features/ai-orchestration/`), WebSocket (`realtime/`), hội thoại CRUD (`conversations/`).

## Mother contract (đã chốt)

```text
Mother LLM  →  soạn nháp / card (propose only)
User bấm Tạo  →  Web POST /api/agents  →  INSERT ownerId=user
Mother KHÔNG tự INSERT / KHÔNG tool create_*
```

- **Đường chính UX:** dropdown **New Agent** (form) → `POST /api/agents`.
- **AucoMother:** coach phụ khi user chưa biết thuê ai — system prompt trong `agent.constants.ts` (`MOTHER_INSTRUCTIONS`).
- **Mother DM:** `POST /api/agents/mother/dm` → Session + default member Mother → chat/stream qua Together **Qwen** (cùng path Session).
- **User-agent DM:** `POST /api/agents/:id/dm` → Session + default member = agent sở hữu → test chat cùng path.
- Mother row seeded (`presetId: mother`).
- Tool allowlist tương lai: `propose_agent`, `list_my_agents`, `list_skill_groups` — **không** `create_agent`.

## Hai loại agent

| Loại | `ownerId` | Ví dụ | Dùng ở đâu |
|------|-----------|-------|------------|
| **System** | `null` · `isSystem: true` | AucoAgent, `@Trợ Lý`, AucoMother | Session / Room / onboarding |
| **User** | `userId` | Mai Content, … | **Room** — add từ danh bạ |

### System agents (seed)

| Agent | `presetId` | Vai trò |
|-------|------------|---------|
| **AucoAgent** | `quick-assistant` | Gắn **mọi Session** |
| **@Trợ Lý** | `orchestrator` | Auto-provision **mọi Room** |
| **AucoMother** | `mother` | Factory — chỉ propose, user ký POST |

Lookup system: `findFirst({ where: { isSystem: true, presetId } })` — `presetId` **không** unique (nhiều user agent có thể dùng cùng slug custom).

### User agents

- Tạo qua Mother wizard (UI 🔜) hoặc client trực tiếp → `POST /api/agents`
- Reject nếu `presetId` trùng system: `quick-assistant` \| `orchestrator` \| `mother`
- Thuộc danh bạ user — tái sử dụng nhiều Room; **không** tự vào Session

## API

| Method | Path | Hành vi |
|--------|------|---------|
| `GET` | `/api/agents` | List `ownerId = user` (`isSystem: false`) |
| `POST` | `/api/agents` | Create user agent + compile prompt |
| `GET` | `/api/agents/:id` | Detail; chỉ owner (hoặc 404) |

🔜 PATCH/DELETE, `GET /api/skill-groups`, web `agentsApi`.

Members gắn agent ↔ conversation: **`conversations/`** — session → Quick Assistant; room → `@Trợ Lý`.

## Cấu trúc

```text
agents/
  agents.controller.ts
  agents.module.ts
  dto/create-agent.dto.ts
  service/
    agents/
    agent-resolver/
    prompt-compiler/
    system-agents/
```

## Quy tắc

| Làm | Không làm |
|-----|-----------|
| User agent `ownerId === userId` | System agent có `ownerId` user |
| Mother chỉ propose | Mother tool `create_agent` / auto-INSERT |
| Recompile khi PATCH (🔜) | Expose sửa raw `instructionsCompiled` tùy ý |
| Test mỗi `*.service.ts` | Hit DB/LLM thật trong unit test |

## Tham chiếu

- [`agent-plan.md`](../../../../agent-plan.md)
- [`conversations/README.md`](../conversations/README.md)
- Shared Zod: `@aucobot/shared` — `createAgentSchema`, `agentResponseSchema`
