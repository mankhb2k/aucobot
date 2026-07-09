"use client";

import { SquarePen, X } from "lucide-react";

import styles from "./ChatPanelHeader.module.css";
import type { ConversationType } from "@aucobot/shared";


const PANEL_TITLE = {
  room: "Thông tin phòng",
  session: "Thông tin phiên",
} as const;

export interface ChatPanelHeaderProps {
  type: ConversationType;
  onClose?: () => void;
  onRename?: () => void;
}

export function ChatPanelHeader({ type, onClose, onRename }: ChatPanelHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={onClose}
        aria-label="Đóng"
        title="Đóng"
      >
        <X className={styles.icon} />
      </button>

      <h2 className={styles.title}>{PANEL_TITLE[type]}</h2>

      <button
        type="button"
        className={styles.iconBtn}
        onClick={onRename}
        aria-label="Đổi tên"
        title="Đổi tên"
      >
        <SquarePen className={styles.icon} />
      </button>
    </header>
  );
}
