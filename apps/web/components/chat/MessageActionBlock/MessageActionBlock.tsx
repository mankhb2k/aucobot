import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";
import { formatMessageTime } from "@/utils/chat/format-time";

import { ChatMarkdown } from "../ChatMarkdown/ChatMarkdown";
import { InlineActionBar } from "../InlineActionBar/InlineActionBar";
import bubbleStyles from "../MessageBubble/MessageBubble.module.css";

import {
  DEFAULT_APPROVAL_ACTIONS,
  resolvedApprovalLabel,
} from "./approval-actions";

import styles from "./MessageActionBlock.module.css";
import type { Message, MessageApproval } from "@/types/chat";

export interface MessageActionBlockProps {
  message: Message;
  approval: MessageApproval;
  showName?: boolean;
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  onAction?: (actionId: string) => void;
  loadingActionId?: string | null;
}

export function MessageActionBlock({
  message,
  approval,
  showName = false,
  isGroupStart = true,
  isGroupEnd = true,
  onAction,
  loadingActionId = null,
}: MessageActionBlockProps) {
  const { senderName, content, createdAt } = message;
  const { status, actions, resolvedLabel } = approval;
  const isPending = status === "pending";
  const visibleActions = isPending
    ? (actions ?? DEFAULT_APPROVAL_ACTIONS)
    : [];
  const resolvedText =
    resolvedLabel ?? resolvedApprovalLabel(status);

  return (
    <div className={styles.row} data-side="in">
      <div className={`${bubbleStyles.avatarSlot} ${styles.avatarSlot}`}>
        {isGroupStart ? (
          <Avatar {...buildAvatarProps(senderName, senderName, { size: "sm" })} />
        ) : null}
      </div>

      <div className={styles.stack}>
        <div
          className={`${bubbleStyles.bubble} ${isPending ? styles.bubbleWithActions : ""}`}
          data-side="in"
          data-group-start={isGroupStart ? "true" : undefined}
          data-group-end={isPending ? undefined : "true"}
        >
          {showName && isGroupStart ? (
            <span className={bubbleStyles.name}>{senderName}</span>
          ) : null}

          <div className={bubbleStyles.content}>
            <ChatMarkdown content={content} />
          </div>

          {!isPending && isGroupEnd ? (
            <span className={bubbleStyles.time}>
              {formatMessageTime(createdAt)}
            </span>
          ) : null}
        </div>

        {isPending ? (
          <>
            <InlineActionBar
              actions={visibleActions}
              onAction={onAction}
              loadingActionId={loadingActionId}
            />
            {isGroupEnd ? (
              <span className={styles.time}>{formatMessageTime(createdAt)}</span>
            ) : null}
          </>
        ) : (
          <p className={styles.resolved} data-status={status}>
            {resolvedText}
          </p>
        )}
      </div>
    </div>
  );
}
