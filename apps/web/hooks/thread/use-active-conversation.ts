"use client";

import { useCallback, useEffect, useState } from "react";

import { conversationsApi, ConversationsApiError } from "@/lib/api/conversations";

import type { ConversationResponse } from "@aucobot/shared";

async function fetchConversationById(id: string): Promise<{
  conversation: ConversationResponse | null;
  error: string | null;
}> {
  try {
    const result = await conversationsApi.getById(id);
    return { conversation: result, error: null };
  } catch (err) {
    const message =
      err instanceof ConversationsApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to load conversation";
    return { conversation: null, error: message };
  }
}

export function useActiveConversation(conversationId: string | null) {
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const result = await fetchConversationById(id);
    setConversation(result.conversation);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!conversationId) {
      return undefined;
    }

    const id = conversationId;
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      setError(null);

      const result = await fetchConversationById(id);
      if (cancelled) {
        return;
      }

      setConversation(result.conversation);
      setError(result.error);
      setLoading(false);
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const activeConversation = conversationId ? conversation : null;
  const activeLoading = conversationId ? loading : false;
  const activeError = conversationId ? error : null;

  return {
    conversation: activeConversation,
    loading: activeLoading,
    error: activeError,
    reload,
  };
}
