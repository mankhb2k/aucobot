
import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { Sidebar } from "./Sidebar";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  args: {
    userName: "Nguyễn An",
    items: mockConversations,
    activeConversationId: mockConversations[0].id,
    onSelectConversation: fn(),
    onNewConversation: fn(),
    onOpenSettings: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
