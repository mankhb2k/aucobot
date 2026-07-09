import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";

import bubbleStyles from "../MessageBubble/MessageBubble.module.css";

import styles from "./TypingIndicator.module.css";

export interface TypingIndicatorProps {
  /** Nhãn phụ trước 3 chấm, vd "Đang nghĩ". */
  label?: string;
  /** Tên agent — hiện avatar cạnh indicator. */
  agentName?: string;
}

export function TypingIndicator({
  label,
  agentName = "Trợ Lý",
}: TypingIndicatorProps) {
  return (
    <div className={styles.row}>
      <div className={`${bubbleStyles.avatarSlot} ${styles.avatarSlot}`}>
        <Avatar {...buildAvatarProps(agentName, agentName, { size: "sm" })} />
      </div>

      <div className={styles.bubble}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <span className={styles.dots} aria-hidden>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.srOnly}>{label ?? "Agent đang trả lời"}</span>
      </div>
    </div>
  );
}
