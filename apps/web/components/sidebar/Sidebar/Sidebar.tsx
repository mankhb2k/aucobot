"use client";

import { useState } from "react";


import { SidebarMain } from "../SidebarMain/SidebarMain";
import { SidebarRail, type RailView } from "../SidebarRail/SidebarRail";

import styles from "./Sidebar.module.css";
import type { Conversation } from "@/types/chat";

interface SidebarProps {
  userName: string;
  items: Conversation[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onOpenSettings?: () => void;
}

export function Sidebar({
  userName,
  items,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onOpenSettings,
}: SidebarProps) {
  const [railView, setRailView] = useState<RailView>("chats");

  return (
    <div className={styles.sidebar}>
      <SidebarRail
        userName={userName}
        activeView={railView}
        onSelectView={setRailView}
        onOpenSettings={onOpenSettings}
      />
      <div className={styles.main}>
        {railView === "chats" ? (
          <SidebarMain
            items={items}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            onNew={onNewConversation}
          />
        ) : (
          <div className={styles.placeholder}>
            <p>Danh bạ agent sẽ có ở phase sau.</p>
          </div>
        )}
      </div>
    </div>
  );
}
