"use client";



import { ChatHeader } from "../ChatHeader/ChatHeader";
import { Composer } from "../Composer/Composer";
import { MessageList } from "../MessageList/MessageList";

import styles from "./ChatArea.module.css";
import type { AgentState, Message } from "@/types/chat";
import type { ConversationResponse } from "@aucobot/shared";

export interface ChatAreaProps {
  conversation: ConversationResponse;
  messages: Message[];
  agentState?: AgentState;
  onSend?: (text: string) => void;
  onOpenInfo?: () => void;
  onSearch?: () => void;
  onRename?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export function ChatArea({
  conversation,
  messages,
  agentState,
  onSend,
  onOpenInfo,
  onSearch,
  onRename,
  onArchive,
  onDelete,
  onBack,
}: ChatAreaProps) {
  return (
    <div className={styles.area}>
      <div className={styles.track}>
        {/* Lớp tin nhắn — cuộn trong cột giữa, nằm dưới header/composer */}
        <div className={styles.messagesLayer}>
          <MessageList
            messages={messages}
            showNames={conversation.type === "room"}
            agentState={agentState}
          />
        </div>

        {/* Header nổi */}
        <div className={styles.headerFloat}>
          <ChatHeader
            conversation={conversation}
            onOpenInfo={onOpenInfo}
            onSearch={onSearch}
            onRename={onRename}
            onArchive={onArchive}
            onDelete={onDelete}
            onBack={onBack}
          />
        </div>

        {/* Composer nổi */}
        <div className={styles.composerFloat}>
          <Composer onSend={onSend} />
        </div>
      </div>
    </div>
  );
}
