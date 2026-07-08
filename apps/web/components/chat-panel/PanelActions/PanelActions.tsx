"use client";

import { ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/outline";

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
          <ArchiveBoxIcon className={styles.icon} />
          Lưu trữ
        </button>
      ) : null}

      {onDelete ? (
        <button
          type="button"
          className={`${styles.action} ${styles.danger}`}
          onClick={onDelete}
        >
          <TrashIcon className={styles.icon} />
          {type === "room" ? "Xoá phòng" : "Xoá phiên"}
        </button>
      ) : null}
    </div>
  );
}
