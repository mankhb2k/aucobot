"use client";

import { useEffect, useState } from "react";

import { useActiveConversation } from "@/hooks/thread/use-active-conversation";
import { useConversationIdFromHash } from "@/hooks/thread/use-conversation-id-from-hash";
import { useConversationList } from "@/hooks/thread/use-conversation-list";
import { ChatMetaPanel } from "../ChatMetaPanel/ChatMetaPanel";
import { ConversationEmptyState } from "../ConversationEmptyState/ConversationEmptyState";
import { CreateConversationView } from "../CreateConversationView/CreateConversationView";

import styles from "./ClientAppShell.module.css";


import type { ConversationType } from "@aucobot/shared";

type CreateView = "room" | "session" | null;

export function ClientAppShell({ userName }: { userName: string }) {
  const { conversationId, openConversation, clearConversation } =
    useConversationIdFromHash();
  const { items, loading, error, refetch } = useConversationList();
  const {
    conversation,
    loading: activeLoading,
    error: activeError,
  } = useActiveConversation(conversationId);
  const [createView, setCreateView] = useState<CreateView>(null);
  const effectiveCreateView = conversationId ? null : createView;

  useEffect(() => {
    if (activeError && conversationId) {
      clearConversation();
    }
  }, [activeError, conversationId, clearConversation]);

  function startCreate(type: ConversationType) {
    clearConversation();
    setCreateView(type);
  }

  function handleCreated(id: string) {
    void refetch();
    openConversation(id);
    setCreateView(null);
  }

  const showEmptyMain =
    !conversationId && !effectiveCreateView && !loading && items.length === 0;

  return (
    <div className={styles.shell} data-chat-shell>
      <aside className={styles.panel}>
        <header className={styles.panelHeader}>
          <p className={styles.panelEyebrow}>Aucobot</p>
          <p className={styles.panelUser}>{userName}</p>
          <div className={styles.panelActions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => startCreate("room")}
            >
              Tạo phòng
            </button>
            <button
              type="button"
              className={styles.actionBtnSecondary}
              onClick={() => startCreate("session")}
            >
              Phiên mới
            </button>
          </div>
        </header>

        {error && (
          <p className={styles.listError} role="alert">
            {error}
          </p>
        )}

        <ul className={styles.threadList}>
          {loading && items.length === 0 ? (
            <li className={styles.listHint}>Đang tải…</li>
          ) : null}
          {items.map((thread) => {
            const active = conversationId === thread.id;

            return (
              <li key={thread.id}>
                <button
                  type="button"
                  className={active ? styles.threadActive : styles.threadItem}
                  onClick={() => {
                    setCreateView(null);
                    openConversation(thread.id);
                  }}
                >
                  <span className={styles.threadType}>
                    {thread.type === "room" ? "Phòng" : "Phiên"}
                  </span>
                  <span className={styles.threadTitle}>{thread.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className={styles.chat}>
        {effectiveCreateView ? (
          <CreateConversationView
            type={effectiveCreateView}
            onBack={() => setCreateView(null)}
            onCreated={(created) => handleCreated(created.id)}
          />
        ) : showEmptyMain ? (
          <ConversationEmptyState
            onCreateRoom={() => startCreate("room")}
            onCreateSession={() => startCreate("session")}
          />
        ) : conversationId && activeLoading ? (
          <div className={styles.chatEmpty}>
            <p className={styles.chatEmptyLead}>Đang tải…</p>
          </div>
        ) : conversation ? (
          <ChatMetaPanel conversation={conversation} />
        ) : !conversationId && items.length > 0 ? (
          <div className={styles.chatEmpty}>
            <p className={styles.chatEmptyTitle}>Chọn một cuộc trò chuyện</p>
            <p className={styles.chatEmptyLead}>
              Chọn phòng hoặc phiên bên trái để bắt đầu.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
