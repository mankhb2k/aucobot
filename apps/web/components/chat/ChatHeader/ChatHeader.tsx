"use client";

import {
  Archive,
  ArrowLeft,
  MoreVertical,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown/Dropdown";
import { FloatingBar } from "@/components/ui/FloatingBar/FloatingBar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";

import styles from "./ChatHeader.module.css";
import type { ConversationResponse } from "@aucobot/shared";


const TYPE_LABEL = {
  room: "Phòng",
  session: "Phiên",
} as const;

const iconProps = { className: styles.actionIcon, strokeWidth: 2 as const };

export interface ChatHeaderProps {
  conversation: ConversationResponse;
  /** Dòng phụ dưới tên (mặc định: loại phòng/phiên). */
  subtitle?: string;
  onOpenInfo?: () => void;
  onSearch?: () => void;
  onRename?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export function ChatHeader({
  conversation,
  subtitle,
  onOpenInfo,
  onSearch,
  onRename,
  onArchive,
  onDelete,
  onBack,
}: ChatHeaderProps) {
  const { type, title } = conversation;
  const statusLine = subtitle ?? TYPE_LABEL[type];

  return (
    <FloatingBar as="header">
      {onBack ? (
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Quay lại"
        >
          <ArrowLeft {...iconProps} />
        </button>
      ) : null}

      <button
        type="button"
        className={styles.identity}
        onClick={onOpenInfo}
        aria-label="Xem thông tin"
      >
        <Avatar {...buildAvatarProps(title, conversation.id, { size: "sm" })} />
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{statusLine}</span>
        </span>
      </button>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={onSearch}
          aria-label="Tìm trong cuộc trò chuyện"
          title="Tìm kiếm"
        >
          <Search {...iconProps} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            variant="unstyled"
            className={styles.actionBtn}
            aria-label="Tùy chọn"
          >
            <MoreVertical
              className={styles.kebabIcon}
              strokeWidth={2}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onRename ? (
              <DropdownMenuItem onSelect={onRename}>
                <SquarePen size={18} strokeWidth={2} />
                Đổi tên
              </DropdownMenuItem>
            ) : null}
            {type === "session" && onArchive ? (
              <DropdownMenuItem onSelect={onArchive}>
                <Archive size={18} strokeWidth={2} />
                Lưu trữ
              </DropdownMenuItem>
            ) : null}
            {onDelete ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger" onSelect={onDelete}>
                  <Trash2 size={18} strokeWidth={2} />
                  {type === "room" ? "Xoá phòng" : "Xoá phiên"}
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </FloatingBar>
  );
}
