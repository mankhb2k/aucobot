import { Users, Zap, type LucideIcon } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";
import { formatFullDate } from "@/utils/chat/format-time";

import styles from "./ChatPanelIdentity.module.css";
import type { ConversationResponse } from "@aucobot/shared";


const TYPE_META = {
  room: { label: "Phòng", Icon: Users },
  session: { label: "Phiên", Icon: Zap },
} as const satisfies Record<
  ConversationResponse["type"],
  { label: string; Icon: LucideIcon }
>;

export interface ChatPanelIdentityProps {
  conversation: ConversationResponse;
}

export function ChatPanelIdentity({ conversation }: ChatPanelIdentityProps) {
  const { id, type, title, description, createdAt } = conversation;
  const { label, Icon } = TYPE_META[type];

  return (
    <section className={styles.identity}>
      <Avatar {...buildAvatarProps(title, id, { size: "lg" })} />

      <h3 className={styles.name}>{title}</h3>

      <div className={styles.meta}>
        <span className={styles.badge} data-type={type}>
          <Icon className={styles.badgeIcon} />
          {label}
        </span>
        <span className={styles.dot} aria-hidden>
          ·
        </span>
        <span className={styles.created}>Tạo {formatFullDate(createdAt)}</span>
      </div>

      {description ? (
        <p className={styles.description}>{description}</p>
      ) : null}
    </section>
  );
}
