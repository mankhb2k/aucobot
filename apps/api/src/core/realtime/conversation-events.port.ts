import type { WsEventEnvelope } from "@aucobot/shared";

export const CONVERSATION_EVENTS_PORT = Symbol("CONVERSATION_EVENTS_PORT");

export interface ConversationEventsPort {
  emit(conversationId: string, event: WsEventEnvelope): void;
  hasClients(conversationId: string): boolean;
}
