import { Users, Zap, type LucideIcon } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";
import { formatConversationTime } from "@/utils/chat/format-time";

import styles from "./ConversationItem.module.css";
import type { Conversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  active?: boolean;
  onSelect?: (id: string) => void;
}

export function ConversationItem({
  conversation,
  active = false,
  onSelect,
}: ConversationItemProps) {
  const { id, type, title, lastMessage, lastMessageAt, unreadCount } =
    conversation;
  const TypeIcon: LucideIcon = type === "room" ? Users : Zap;
  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ""}`}
      onClick={() => onSelect?.(id)}
      aria-current={active}
      data-unread={hasUnread ? "true" : undefined}
    >
      <span className={styles.avatarWrap}>
        <Avatar {...buildAvatarProps(title, id, { size: "md" })} />
        <span className={styles.typeBadge} data-type={type}>
          <TypeIcon className={styles.typeIcon} />
        </span>
      </span>

      <span className={styles.body}>
        <span className={styles.topRow}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>
            {formatConversationTime(lastMessageAt)}
          </span>
        </span>
        <span className={styles.bottomRow}>
          <span className={styles.preview}>{lastMessage}</span>
          {hasUnread && (
            <span className={styles.unread}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
