"use client";

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
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/Dropdown/Dropdown";

import { SidebarHeaderNav } from "../SidebarHeaderNav/SidebarHeaderNav";
import { SidebarHeader } from "./SidebarHeader";
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

function SidebarHeaderStory(
  props: Omit<
    ComponentProps<typeof SidebarHeader>,
    "searchValue" | "onSearchValueChange" | "nav"
  >,
) {
  const [searchValue, setSearchValue] = useState("");
  const [navValue, setNavValue] = useState("all");

  return (
    <SidebarHeader
      {...props}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
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
  title: "App/SidebarHeader",
  component: SidebarHeaderStory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    searchLabel: { control: "text" },
    searchPlaceholder: { control: "text" },
    searchClearAriaLabel: { control: "text" },
    menuAriaLabel: { control: "text" },
    composeAriaLabel: { control: "text" },
    onMenuClick: { action: "onMenuClick" },
    onComposeClick: { action: "onComposeClick" },
  },
  args: {
    title: "Aucobot",
    searchLabel: "Tìm kiếm hội thoại",
    searchPlaceholder: "Tìm kiếm",
    searchClearAriaLabel: "Xóa tìm kiếm",
    menuAriaLabel: "Mở menu",
    menuIcon: <Menu {...iconProps} />,
    menuContent: (
      <>
        <DropdownMenuItem onSelect={fn()}>Cài đặt</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={fn()}>Đăng xuất</DropdownMenuItem>
      </>
    ),
    composeAriaLabel: "Tạo hội thoại mới",
    composeIcon: <SquarePen {...iconProps} />,
    onComposeClick: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "var(--sidebar-main-width)",
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
