import {
  Bolt,
  Mail,
  MessagesSquare,
  MoreHorizontal,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

import { SidebarHeaderNav } from "./SidebarHeaderNav";
import type { SidebarHeaderNavItem } from "./SidebarHeaderNav";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const iconProps = { strokeWidth: 2.5 };

const NAV_ITEMS: SidebarHeaderNavItem[] = [
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

function SidebarHeaderNavStory({
  items,
  initialValue,
  ariaLabel,
  overflowAriaLabel,
}: {
  items: SidebarHeaderNavItem[];
  initialValue: string;
  ariaLabel: string;
  overflowAriaLabel: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <SidebarHeaderNav
      items={items}
      value={value}
      onValueChange={setValue}
      ariaLabel={ariaLabel}
      overflowAriaLabel={overflowAriaLabel}
      overflowIcon={<MoreHorizontal {...iconProps} />}
    />
  );
}

const meta = {
  title: "App/SidebarHeaderNav",
  component: SidebarHeaderNavStory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    items: NAV_ITEMS,
    initialValue: "all",
    ariaLabel: "Lọc hội thoại",
    overflowAriaLabel: "Xem thêm bộ lọc",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "var(--sidebar-main-width)",
          padding: "0 var(--space-4)",
          background: "var(--color-panel)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarHeaderNavStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NarrowOverflow: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          width: "220px",
          padding: "0 var(--space-4)",
          background: "var(--color-panel)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
