import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";
import { formatMessageTime } from "@/utils/chat/format-time";

import { ChatMarkdown } from "../ChatMarkdown/ChatMarkdown";

import styles from "./MessageBubble.module.css";
import type { Message } from "@/types/chat";

export interface MessageBubbleProps {
  message: Message;
  /** Hiện tên người gửi (agent) — dùng trong phòng nhiều thành viên. */
  showName?: boolean;
  /** Tin đầu cụm — hiện avatar (agent) + tên. */
  isGroupStart?: boolean;
  /** Tin cuối cụm — hiện giờ. */
  isGroupEnd?: boolean;
}

export function MessageBubble({
  message,
  showName = false,
  isGroupStart = true,
  isGroupEnd = true,
}: MessageBubbleProps) {
  const { senderType, senderName, content, createdAt } = message;

  if (senderType === "system") {
    return (
      <div className={styles.system}>
        <span className={styles.systemText}>{content}</span>
      </div>
    );
  }

  const isUser = senderType === "user";
  const side = isUser ? "out" : "in";

  return (
    <div className={styles.row} data-side={side}>
      {!isUser ? (
        <div className={styles.avatarSlot}>
          {isGroupStart ? (
            <Avatar {...buildAvatarProps(senderName, senderName, { size: "sm" })} />
          ) : null}
        </div>
      ) : null}

      <div
        className={styles.bubble}
        data-side={side}
        data-group-start={isGroupStart ? "true" : undefined}
        data-group-end={isGroupEnd ? "true" : undefined}
      >
        {showName && !isUser && isGroupStart ? (
          <span className={styles.name}>{senderName}</span>
        ) : null}

        <div className={styles.content}>
          {isUser ? content : <ChatMarkdown content={content} />}
        </div>

        {isGroupEnd ? (
          <span className={styles.time}>{formatMessageTime(createdAt)}</span>
        ) : null}
      </div>
    </div>
  );
}
