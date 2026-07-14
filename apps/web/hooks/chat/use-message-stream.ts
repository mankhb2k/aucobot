"use client";

import { useEffect, useRef } from "react";

import { mapMessageToUi } from "@/lib/conversations/map-message";
import { connectAgentStream } from "@/lib/stream/agent-stream-client";
import { useMessageStore } from "@/stores/message/message.store";

import type { MessageResponse } from "@aucobot/shared";

/**
 * Connect WSS for a session conversation and project chunk/done into message store.
 */
export function useMessageStream(conversationId: string | null, enabled: boolean) {
  const appendChunk = useMessageStore((s) => s.appendChunk);
  const finalizeStream = useMessageStore((s) => s.finalizeStream);
  const clearStreaming = useMessageStore((s) => s.clearStreaming);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !conversationId) {
      connectedRef.current = false;
      return undefined;
    }

    const client = connectAgentStream(conversationId, {
      onOpen: () => {
        connectedRef.current = true;
      },
      onClose: () => {
        connectedRef.current = false;
      },
      onChunk: ({ messageId, delta }) => {
        appendChunk(conversationId, messageId, delta);
      },
      onDone: ({ messageId, streamingId, content }) => {
        const mapped = mapMessageToUi({
          id: messageId,
          conversationId,
          senderType: "agent",
          agentId: null,
          content,
          createdAt: new Date().toISOString(),
        } satisfies MessageResponse);
        finalizeStream(conversationId, streamingId, mapped);
      },
    });

    return () => {
      connectedRef.current = false;
      clearStreaming(conversationId);
      client.close();
    };
  }, [
    appendChunk,
    clearStreaming,
    conversationId,
    enabled,
    finalizeStream,
  ]);
}
