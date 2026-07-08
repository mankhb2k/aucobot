
import { fn } from "storybook/test";

import { SidebarRail } from "./SidebarRail";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/SidebarRail",
  component: SidebarRail,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    userName: "Nguyễn An",
    onSelectView: fn(),
    onOpenSettings: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Chats: Story = {
  args: { activeView: "chats" },
};

export const Contacts: Story = {
  args: { activeView: "contacts" },
};
