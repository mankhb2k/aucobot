import { z } from "zod";

export const wsEventTypeSchema = z.enum([
  "message.chunk",
  "message.done",
  "approval.updated",
  "job.status",
  "ping",
  "pong",
]);

export type WsEventType = z.infer<typeof wsEventTypeSchema>;

export const messageChunkPayloadSchema = z.object({
  messageId: z.string(),
  delta: z.string(),
});

export type MessageChunkPayload = z.infer<typeof messageChunkPayloadSchema>;

export const messageDonePayloadSchema = z.object({
  messageId: z.string(),
  streamingId: z.string(),
  content: z.string(),
});

export type MessageDonePayload = z.infer<typeof messageDonePayloadSchema>;

export const wsEventEnvelopeSchema = z.object({
  type: wsEventTypeSchema,
  conversationId: z.string(),
  timestamp: z.string(),
  payload: z.unknown(),
});

export type WsEventEnvelope = z.infer<typeof wsEventEnvelopeSchema>;

export function createWsEvent<T>(
  type: WsEventType,
  conversationId: string,
  payload: T,
): WsEventEnvelope {
  return {
    type,
    conversationId,
    timestamp: new Date().toISOString(),
    payload,
  };
}
