
import { ChatInlineButton } from "../ChatInlineButton/ChatInlineButton";

import styles from "./InlineActionBar.module.css";
import type { InlineAction } from "@/types/chat";

export interface InlineActionBarProps {
  actions: InlineAction[];
  onAction?: (actionId: string) => void;
  loadingActionId?: string | null;
  disabled?: boolean;
  /** Nhãn a11y cho nhóm nút. */
  ariaLabel?: string;
}

export function InlineActionBar({
  actions,
  onAction,
  loadingActionId = null,
  disabled = false,
  ariaLabel = "Hành động",
}: InlineActionBarProps) {
  return (
    <div className={styles.bar} role="group" aria-label={ariaLabel}>
      {actions.map((action) => {
        const isLoading = loadingActionId === action.id;
        const isBlocked =
          disabled || (loadingActionId != null && !isLoading);

        return (
          <ChatInlineButton
            key={action.id}
            loading={isLoading}
            disabled={isBlocked}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </ChatInlineButton>
        );
      })}
    </div>
  );
}
