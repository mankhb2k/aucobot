import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { ConversationItem } from "./ConversationItem";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "App/ConversationItem",
  component: ConversationItem,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: "var(--sidebar-main-width)",
          background: "var(--color-panel)",
          padding: "var(--space-2)",
          borderRadius: "var(--radius-md)",
        }}
      >
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
