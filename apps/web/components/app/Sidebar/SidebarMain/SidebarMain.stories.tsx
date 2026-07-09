import {
  Bolt,
  Mail,
  Menu,
  MessagesSquare,
  MoreHorizontal,
  SquarePen,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import { SidebarHeader } from "@/components/app/Sidebar/SidebarHeader/SidebarHeader";
import { SidebarHeaderNav } from "@/components/app/Sidebar/SidebarHeaderNav/SidebarHeaderNav";
import { SidebarMain as ConversationSidebarMain } from "@/components/sidebar/SidebarMain/SidebarMain";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/Dropdown/Dropdown";
import { mockConversations } from "@/mock/chat";

import { SidebarMain } from "./SidebarMain";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const iconProps = { strokeWidth: 2.5 };

const navItems = [
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
    icon: <Bolt {...iconProps} />,
  },
  {
    value: "starred",
    label: "Đã ghim",
    icon: <Star {...iconProps} />,
  },
];

function SidebarHeaderSlot() {
  const [searchValue, setSearchValue] = useState("");
  const [navValue, setNavValue] = useState("all");

  return (
    <SidebarHeader
      title="Aucobot"
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      searchLabel="Tìm kiếm hội thoại"
      searchPlaceholder="Tìm kiếm"
      searchClearAriaLabel="Xóa tìm kiếm"
      menuAriaLabel="Mở menu"
      menuIcon={<Menu {...iconProps} />}
      menuContent={
        <>
          <DropdownMenuItem onSelect={fn()}>Cài đặt</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={fn()}>Đăng xuất</DropdownMenuItem>
        </>
      }
      composeAriaLabel="Tạo hội thoại mới"
      composeIcon={<SquarePen {...iconProps} />}
      onComposeClick={fn()}
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
  );
}

const meta = {
  title: "App/SidebarMain",
  component: SidebarMain,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    header: <SidebarHeaderSlot />,
    content: (
      <ConversationSidebarMain
        items={mockConversations}
        activeId={mockConversations[0].id}
        onSelect={fn()}
        onNew={fn()}
      />
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyContent: Story = {
  args: {
    content: (
      <ConversationSidebarMain
        items={[]}
        onSelect={fn()}
        onNew={fn()}
      />
    ),
  },
};
