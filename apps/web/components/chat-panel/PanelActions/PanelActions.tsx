"use client";

import { Archive, Trash2 } from "lucide-react";

import styles from "./PanelActions.module.css";
import type { ConversationType } from "@aucobot/shared";


export interface PanelActionsProps {
  type: ConversationType;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function PanelActions({ type, onArchive, onDelete }: PanelActionsProps) {
  return (
    <div className={styles.actions}>
      {type === "session" && onArchive ? (
        <button type="button" className={styles.action} onClick={onArchive}>
          <Archive className={styles.icon} />
          Lưu trữ
        </button>
      ) : null}

      {onDelete ? (
        <button
          type="button"
          className={`${styles.action} ${styles.danger}`}
          onClick={onDelete}
        >
          <Trash2 className={styles.icon} />
          {type === "room" ? "Xoá phòng" : "Xoá phiên"}
        </button>
      ) : null}
    </div>
  );
}
