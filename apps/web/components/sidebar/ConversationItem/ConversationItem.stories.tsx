
import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { ConversationItem } from "./ConversationItem";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/ConversationItem",
  component: ConversationItem,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Room: Story = {
  args: { conversation: mockConversations[0] },
};

export const Session: Story = {
  args: { conversation: mockConversations[2] },
};

export const Active: Story = {
  args: { conversation: mockConversations[0], active: true },
};

export const NoUnread: Story = {
  args: { conversation: mockConversations[1] },
};
