"use client";

import {
  Mail,
  Menu,
  MessagesSquare,
  MoreHorizontal,
  SquarePen,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { SidebarHeader } from "@/components/app/Sidebar/SidebarHeader/SidebarHeader";
import {
  SidebarHeaderNav,
  type SidebarHeaderNavItem,
} from "@/components/app/Sidebar/SidebarHeaderNav/SidebarHeaderNav";
import { SidebarMain } from "@/components/app/Sidebar/SidebarMain/SidebarMain";

import styles from "./ClientAppShell.module.css";

interface ClientAppShellProps {
  userName: string;
}

const iconProps = { strokeWidth: 2.5 };

export function ClientAppShell({ userName }: ClientAppShellProps) {
  void userName;
  const [searchValue, setSearchValue] = useState("");
  const [navValue, setNavValue] = useState("all");

  const navItems = useMemo<SidebarHeaderNavItem[]>(
    () => [
      {
        value: "all",
        label: "Tất cả",
        icon: <MessagesSquare {...iconProps} />,
      },
      {
        value: "unread",
        label: "Chưa đọc",
        icon: <Mail {...iconProps} />,
      },
      {
        value: "rooms",
        label: "Phòng",
        icon: <Users {...iconProps} />,
      },
      {
        value: "sessions",
        label: "Phiên",
        icon: <Zap {...iconProps} />,
      },
    ],
    [],
  );

  return (
    <div className={styles.shell} data-chat-shell>
      <aside className={styles.sidebar} aria-label="Sidebar">
        <SidebarMain
          header={
            <SidebarHeader
              title="Aucobot"
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              searchLabel="Tìm kiếm hội thoại"
              searchPlaceholder="Tìm kiếm"
              searchClearAriaLabel="Xóa tìm kiếm"
              menuAriaLabel="Mở menu"
              menuIcon={<Menu {...iconProps} />}
              composeAriaLabel="Tạo hội thoại mới"
              composeIcon={<SquarePen {...iconProps} />}
              nav={
                <SidebarHeaderNav
                  items={navItems}
                  value={navValue}
                  onValueChange={setNavValue}
                  ariaLabel="Lọc hội thoại"
                  overflowAriaLabel="Xem thêm bộ lọc"
                  overflowIcon={<MoreHorizontal {...iconProps} />}
                />
              }
            />
          }
          content={null}
        />
      </aside>

      <main className={styles.content} aria-label="Content" />
    </div>
  );
}
