"use client";

import { useCallback, useEffect, useState } from "react";

import { conversationsApi, ConversationsApiError } from "@/lib/api/conversations";

import type { ConversationResponse } from "@aucobot/shared";

async function fetchConversationList(): Promise<{
  items: ConversationResponse[];
  error: string | null;
}> {
  try {
    const result = await conversationsApi.list();
    return { items: result.items, error: null };
  } catch (err) {
    const message =
      err instanceof ConversationsApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Failed to load conversations";
    return { items: [], error: message };
  }
}

export function useConversationList() {
  const [items, setItems] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchConversationList();
    setItems(result.items);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      setError(null);

      const result = await fetchConversationList();
      if (cancelled) return;

      setItems(result.items);
      setError(result.error);
      setLoading(false);
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error, refetch };
}
