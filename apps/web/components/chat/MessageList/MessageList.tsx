"use client";

import { Fragment, useEffect, useRef } from "react";

import { dayKey } from "@/utils/chat/format-time";

import { AgentActivityCard } from "../AgentActivityCard/AgentActivityCard";
import { DateDivider } from "../DateDivider/DateDivider";
import { MessageActionBlock } from "../MessageActionBlock/MessageActionBlock";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

import styles from "./MessageList.module.css";
import type { AgentState, Message } from "@/types/chat";

export interface MessageListProps {
  messages: Message[];
  /** Hiện tên người gửi trên bong bóng agent (phòng nhiều thành viên). */
  showNames?: boolean;
  emptyLabel?: string;
  /** Trạng thái agent để hiện cuối thread (đang nghĩ / đang làm việc). */
  agentState?: AgentState;
  /** User bấm nút duyệt inline (Duyệt / Từ chối / Sửa). */
  onApprovalAction?: (messageId: string, actionId: string) => void;
  loadingApprovalActionId?: string | null;
}

function isSameSender(a: Message, b: Message): boolean {
  return (
    a.senderType !== "system" &&
    a.senderType === b.senderType &&
    a.senderName === b.senderName &&
    dayKey(a.createdAt) === dayKey(b.createdAt)
  );
}

function resolveAgentName(messages: Message[], fallback = "Trợ Lý"): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.senderType === "agent" && message.senderName) {
      return message.senderName;
    }
  }
  return fallback;
}

export function MessageList({
  messages,
  showNames = false,
  emptyLabel = "Chưa có tin nhắn nào.",
  agentState = { kind: "idle" },
  onApprovalAction,
  loadingApprovalActionId = null,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, agentState]);

  const agentBusy =
    agentState.kind === "thinking" || agentState.kind === "working";
  const agentName = resolveAgentName(messages);

  const agentNode =
    agentState.kind === "thinking" ? (
      <TypingIndicator agentName={agentName} />
    ) : agentState.kind === "working" ? (
      <AgentActivityCard
        activities={agentState.activities}
        agentName={agentName}
      />
    ) : null;

  if (messages.length === 0 && !agentBusy) {
    return (
      <div className={styles.list}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>{emptyLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.inner}>
        {messages.map((message, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const showDivider =
            !prev || dayKey(prev.createdAt) !== dayKey(message.createdAt);
          const isGroupStart =
            showDivider || !prev || !isSameSender(prev, message);
          const isGroupEnd = !next || !isSameSender(message, next);

          return (
            <Fragment key={message.id}>
              {showDivider ? <DateDivider date={message.createdAt} /> : null}
              {message.approval ? (
                <MessageActionBlock
                  message={message}
                  approval={message.approval}
                  showName={showNames}
                  isGroupStart={isGroupStart}
                  isGroupEnd={isGroupEnd}
                  onAction={(actionId) =>
                    onApprovalAction?.(message.id, actionId)
                  }
                  loadingActionId={loadingApprovalActionId}
                />
              ) : (
                <MessageBubble
                  message={message}
                  showName={showNames}
                  isGroupStart={isGroupStart}
                  isGroupEnd={isGroupEnd}
                />
              )}
            </Fragment>
          );
        })}
        {agentNode}
        <div ref={endRef} />
      </div>
    </div>
  );
}
