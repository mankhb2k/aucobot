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

import { ConversationList } from "@/components/app/Sidebar/ConversationList/ConversationList";
import { SidebarHeader } from "@/components/app/Sidebar/SidebarHeader/SidebarHeader";
import {
  SidebarHeaderNav,
  type SidebarHeaderNavItem,
} from "@/components/app/Sidebar/SidebarHeaderNav/SidebarHeaderNav";
import { SidebarMain } from "@/components/app/Sidebar/SidebarMain/SidebarMain";
import { DropdownMenuItem } from "@/components/ui/Dropdown/Dropdown";
import { useAuthGuard } from "@/hooks/auth/use-auth-guard";
import { useConversationIdFromHash } from "@/hooks/thread/use-conversation-id-from-hash";
import { useConversationList } from "@/hooks/thread/use-conversation-list";
import { mapConversationToSidebarItem } from "@/utils/chat/map-conversation";

import styles from "./ClientAppShell.module.css";

const iconProps = { strokeWidth: 2 };

export function ClientAppShell() {
  const { status: authStatus } = useAuthGuard();
  const [searchValue, setSearchValue] = useState("");
  const [navValue, setNavValue] = useState("all");
  const { items: apiItems, loading, error } = useConversationList();
  const { conversationId, openConversation } = useConversationIdFromHash();

  const conversations = useMemo(
    () => apiItems.map(mapConversationToSidebarItem),
    [apiItems],
  );

  const filteredItems = useMemo(() => {
    let result = conversations;

    if (navValue === "unread") {
      result = result.filter((item) => item.unreadCount > 0);
    } else if (navValue === "rooms") {
      result = result.filter((item) => item.type === "room");
    } else if (navValue === "sessions") {
      result = result.filter((item) => item.type === "session");
    }

    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return result;
    }

    return result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.lastMessage.toLowerCase().includes(query),
    );
  }, [conversations, navValue, searchValue]);

  const listEmptyLabel = useMemo(() => {
    if (loading) {
      return "Đang tải...";
    }
    if (error) {
      return error;
    }
    if (searchValue.trim()) {
      return "Không tìm thấy kết quả.";
    }
    if (navValue !== "all") {
      return "Không có hội thoại trong mục này.";
    }
    return "Chưa có cuộc trò chuyện nào.";
  }, [loading, error, searchValue, navValue]);

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

  if (authStatus !== "authenticated") {
    return <div className={styles.shell} data-chat-shell />;
  }

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
              menuIcon={<Menu />}
              composeAriaLabel="Tạo hội thoại mới"
              composeIcon={<SquarePen />}
              composeContent={
                <>
                  <DropdownMenuItem onSelect={() => {}}>
                    <Zap {...iconProps} />
                    Phiên làm việc mới
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {}}>
                    <Users {...iconProps} />
                    Nhóm mới
                  </DropdownMenuItem>
                </>
              }
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
          content={
            <div className={styles.listRegion}>
              <ConversationList
                items={loading ? [] : filteredItems}
                activeId={conversationId}
                onSelect={openConversation}
                emptyLabel={listEmptyLabel}
              />
            </div>
          }
        />
      </aside>

      <main className={styles.content} aria-label="Content" />
    </div>
  );
}
