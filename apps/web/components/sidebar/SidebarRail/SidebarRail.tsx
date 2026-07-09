import { MessagesSquare, Settings, Users, type LucideIcon } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar/Avatar";
import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";

import styles from "./SidebarRail.module.css";

export type RailView = "chats" | "contacts";

interface SidebarRailProps {
  userName: string;
  activeView?: RailView;
  onSelectView?: (view: RailView) => void;
  onOpenSettings?: () => void;
}

const NAV: {
  view: RailView;
  label: string;
  Icon: LucideIcon;
}[] = [
  { view: "chats", label: "Đoạn chat", Icon: MessagesSquare },
  { view: "contacts", label: "Agent", Icon: Users },
];

export function SidebarRail({
  userName,
  activeView = "chats",
  onSelectView,
  onOpenSettings,
}: SidebarRailProps) {
  return (
    <nav className={styles.rail} aria-label="Điều hướng chính">
      <button
        type="button"
        className={styles.avatarBtn}
        aria-label={userName}
        title={userName}
      >
        <Avatar {...buildAvatarProps(userName, userName, { size: "sm" })} />
      </button>

      <div className={styles.nav}>
        {NAV.map(({ view, label, Icon }) => (
          <button
            key={view}
            type="button"
            className={`${styles.navBtn} ${
              activeView === view ? styles.navActive : ""
            }`}
            onClick={() => onSelectView?.(view)}
            aria-label={label}
            title={label}
            aria-current={activeView === view}
          >
            <Icon className={styles.navIcon} />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.navBtn}
        onClick={onOpenSettings}
        aria-label="Cài đặt"
        title="Cài đặt"
      >
        <Settings className={styles.navIcon} />
      </button>
    </nav>
  );
}
