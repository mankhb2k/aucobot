"use client";

import { useCallback, useState } from "react";

import { messagesApi } from "@/lib/api/messages";
import { mapMessageToUi } from "@/lib/conversations/map-message";
import { useMessageStore } from "@/stores/message/message.store";

/**
 * REST send for session conversations. Assistant arrives via WS when streaming;
 * otherwise assistantMessage is upserted from the REST body.
 */
export function useSendMessage(conversationId: string | null) {
  const upsertMessage = useMessageStore((s) => s.upsertMessage);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return;
      setSending(true);
      setError(null);

      try {
        const result = await messagesApi.create(conversationId, {
          content: content.trim(),
        });

        upsertMessage(conversationId, mapMessageToUi(result.userMessage));

        if (result.assistantMessage && !result.streaming) {
          upsertMessage(conversationId, mapMessageToUi(result.assistantMessage));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversationId, upsertMessage],
  );

  return { send, sending, error };
}
