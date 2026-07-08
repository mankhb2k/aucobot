
import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { SidebarMain } from "./SidebarMain";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/SidebarMain",
  component: SidebarMain,
  parameters: { layout: "fullscreen" },
  args: { onSelect: fn(), onNew: fn(), items: mockConversations },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { activeId: mockConversations[0].id },
};

export const Empty: Story = {
  args: { items: [] },
};
