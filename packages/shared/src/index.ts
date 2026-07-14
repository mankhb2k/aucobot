export {
  agentDmResponseSchema,
  agentListResponseSchema,
  agentResponseSchema,
  agentTonePresetSchema,
  createAgentSchema,
  motherDmResponseSchema,
  SYSTEM_AGENT_PRESET_IDS,
  type AgentDmResponse,
  type AgentListResponse,
  type AgentResponse,
  type AgentTonePreset,
  type CreateAgentInput,
  type MotherDmResponse,
  type SystemAgentPresetId,
} from "./agents";

export {
  conversationListResponseSchema,
  conversationResponseSchema,
  conversationTypeSchema,
  createConversationSchema,
  type ConversationListResponse,
  type ConversationResponse,
  type ConversationType,
  type CreateConversationInput,
} from "./conversations";

export {
  createMessageSchema,
  messageListResponseSchema,
  messageResponseSchema,
  messageSenderTypeSchema,
  sendMessageResponseSchema,
  type CreateMessageInput,
  type MessageListResponse,
  type MessageResponse,
  type MessageSenderType,
  type SendMessageResponse,
} from "./messages";

export {
  createWsEvent,
  messageChunkPayloadSchema,
  messageDonePayloadSchema,
  wsEventEnvelopeSchema,
  wsEventTypeSchema,
  type MessageChunkPayload,
  type MessageDonePayload,
  type WsEventEnvelope,
  type WsEventType,
} from "./realtime";

export {
  emailOtpPurposeSchema,
  resendEmailCodeSchema,
  sendEmailCodeSchema,
  verifyEmailCodeSchema,
  type EmailOtpPurpose,
  type ResendEmailCodeInput,
  type SendEmailCodeInput,
  type SendEmailCodeResponse,
  type VerifyEmailCodeInput,
} from "./auth-otp";

export const API_DEFAULT_PORT = 8387;
export const WEB_DEFAULT_PORT = 8386;

export interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  database: "connected" | "disconnected";
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  timezone: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

/** JWT access token expiry (ISO). Null when no valid access cookie. */
export interface AuthSessionMeta {
  accessExpiresAt: string | null;
}

export interface AuthSuccessResponse {
  user: UserResponse;
  accessExpiresAt: string;
}

export interface DevLoginCookieInfo {
  name: string;
  value: string;
  path: string;
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  maxAgeMs: number;
}

export interface DevLoginResponse {
  ok: true;
  user: UserResponse;
  accessExpiresAt: string;
  cookies: {
    access_token: DevLoginCookieInfo;
    refresh_token: DevLoginCookieInfo;
  };
  cookieUsageNote: string;
}
