import { ConversationItem } from "../ConversationItem/ConversationItem";

import styles from "./ConversationList.module.css";
import type { Conversation } from "@/types/chat";

interface ConversationListProps {
  items: Conversation[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  /** Thông báo khi danh sách rỗng (vd. sau khi tìm kiếm không ra). */
  emptyLabel?: string;
}

export function ConversationList({
  items,
  activeId,
  onSelect,
  emptyLabel = "Chưa có cuộc trò chuyện nào.",
}: ConversationListProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyLabel}</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((conversation) => (
        <li key={conversation.id}>
          <ConversationItem
            conversation={conversation}
            active={conversation.id === activeId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
