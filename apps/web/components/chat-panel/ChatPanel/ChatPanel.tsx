"use client";

import { BellIcon, CpuChipIcon } from "@heroicons/react/24/outline";

import {
  formatConversationTime,
  formatFullDate,
} from "@/utils/chat/format-time";


import { ChatPanelHeader } from "../ChatPanelHeader/ChatPanelHeader";
import { ChatPanelIdentity } from "../ChatPanelIdentity/ChatPanelIdentity";
import { PanelActions } from "../PanelActions/PanelActions";
import { PanelFutureRow } from "../PanelFutureRow/PanelFutureRow";
import { PanelInfoRow } from "../PanelInfoRow/PanelInfoRow";
import { PanelSection } from "../PanelSection/PanelSection";

import styles from "./ChatPanel.module.css";
import type { ConversationResponse } from "@aucobot/shared";

const TYPE_LABEL = {
  room: "Phòng",
  session: "Phiên",
} as const;

export interface ChatPanelProps {
  conversation: ConversationResponse;
  onClose?: () => void;
  onRename?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatPanel({
  conversation,
  onClose,
  onRename,
  onArchive,
  onDelete,
}: ChatPanelProps) {
  const { id, type, lastMessageAt, createdAt } = conversation;

  return (
    <aside className={styles.panel} aria-label="Thông tin hội thoại">
      <ChatPanelHeader
        type={type}
        onClose={onClose}
        onRename={onRename ? () => onRename(id) : undefined}
      />

      <div className={styles.body}>
        <ChatPanelIdentity conversation={conversation} />

        <PanelSection>
          <PanelInfoRow label="Loại" value={TYPE_LABEL[type]} />
          <PanelInfoRow label="Tạo lúc" value={formatFullDate(createdAt)} />
          <PanelInfoRow
            label="Hoạt động"
            value={
              lastMessageAt ? formatConversationTime(lastMessageAt) : "Chưa có"
            }
          />
          <PanelInfoRow label="ID" value={id} copyable mono />
        </PanelSection>

        <PanelSection>
          <PanelFutureRow icon={BellIcon} label="Thông báo" trailing="toggle" />
          <PanelFutureRow icon={CpuChipIcon} label="Agent trong phòng" />
        </PanelSection>

        <PanelActions
          type={type}
          onArchive={onArchive ? () => onArchive(id) : undefined}
          onDelete={onDelete ? () => onDelete(id) : undefined}
        />
      </div>
    </aside>
  );
}
