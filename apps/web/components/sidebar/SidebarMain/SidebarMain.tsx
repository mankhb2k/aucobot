"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";


import { ConversationList } from "../ConversationList/ConversationList";
import { SearchBar } from "../SearchBar/SearchBar";

import styles from "./SidebarMain.module.css";
import type { Conversation } from "@/types/chat";

interface SidebarMainProps {
  items: Conversation[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  title?: string;
}

export function SidebarMain({
  items,
  activeId,
  onSelect,
  onNew,
  title = "Đoạn chat",
}: SidebarMainProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.newBtn}
          onClick={onNew}
          aria-label="Tạo cuộc trò chuyện mới"
        >
          <PencilSquareIcon className={styles.newIcon} />
        </button>
      </header>

      <div className={styles.searchRow}>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className={styles.listRegion}>
        <ConversationList
          items={filtered}
          activeId={activeId}
          onSelect={onSelect}
          emptyLabel={
            query ? "Không tìm thấy kết quả." : "Chưa có cuộc trò chuyện nào."
          }
        />
      </div>
    </div>
  );
}
