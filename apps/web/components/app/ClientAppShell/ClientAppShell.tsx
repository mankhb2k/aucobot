"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import { ChatArea } from "@/components/chat/ChatArea/ChatArea";
import { ChatPanel } from "@/components/chat-panel/ChatPanel/ChatPanel";
import { Sidebar } from "@/components/sidebar/Sidebar/Sidebar";
import { useActiveConversation } from "@/hooks/thread/use-active-conversation";
import { useConversationIdFromHash } from "@/hooks/thread/use-conversation-id-from-hash";
import { useConversationList } from "@/hooks/thread/use-conversation-list";
import { mapConversationToSidebarItem } from "@/utils/chat/map-conversation";

import styles from "./ClientAppShell.module.css";

type MobilePane = "list" | "chat";

interface ClientAppShellProps {
  userName: string;
}

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");

    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

export function ClientAppShell({ userName }: ClientAppShellProps) {
  const isMobile = useIsMobileLayout();
  const { conversationId, openConversation, clearConversation } =
    useConversationIdFromHash();
  const { items } = useConversationList();
  const {
    conversation,
    loading: conversationLoading,
    error: conversationError,
  } = useActiveConversation(conversationId);

  const [mobilePane, setMobilePane] = useState<MobilePane>("list");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const sidebarItems = useMemo(
    () => items.map(mapConversationToSidebarItem),
    [items],
  );

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setMobilePane(conversationId ? "chat" : "list");
  }, [conversationId, isMobile]);

  useEffect(() => {
    if (!conversationId) {
      setIsPanelOpen(false);
    }
  }, [conversationId]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      openConversation(id);
      if (isMobile) {
        setMobilePane("chat");
      }
    },
    [isMobile, openConversation],
  );

  const handleBackToList = useCallback(() => {
    clearConversation();
    setIsPanelOpen(false);
    if (isMobile) {
      setMobilePane("list");
    }
  }, [clearConversation, isMobile]);

  const showPanel = isPanelOpen && conversation != null;

  let chatContent: ReactNode;

  if (!conversationId) {
    chatContent = (
      <div className={styles.centerMessage}>
        Chọn một cuộc trò chuyện từ danh sách bên trái.
      </div>
    );
  } else if (conversationLoading) {
    chatContent = (
      <div className={styles.centerMessage}>Đang tải hội thoại…</div>
    );
  } else if (conversationError) {
    chatContent = (
      <div className={styles.centerMessage} data-tone="error">
        {conversationError}
      </div>
    );
  } else if (conversation) {
    chatContent = (
      <ChatArea
        conversation={conversation}
        messages={[]}
        onSend={(text) => console.log("send", text)}
        onOpenInfo={() => setIsPanelOpen(true)}
        onBack={isMobile ? handleBackToList : undefined}
      />
    );
  } else {
    chatContent = (
      <div className={styles.centerMessage} data-tone="error">
        Không tìm thấy hội thoại.
      </div>
    );
  }

  return (
    <div
      className={styles.shell}
      data-chat-shell
      data-mobile-pane={isMobile ? mobilePane : undefined}
    >
      <aside className={styles.sidebarRegion}>
        <Sidebar
          userName={userName}
          items={sidebarItems}
          activeConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
        />
      </aside>

      <main className={styles.chatRegion}>{chatContent}</main>

      {showPanel ? (
        <aside className={styles.panelRegion}>
          <ChatPanel
            conversation={conversation}
            onClose={() => setIsPanelOpen(false)}
          />
        </aside>
      ) : null}
    </div>
  );
}
