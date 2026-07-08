
import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { ConversationList } from "./ConversationList";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/ConversationList",
  component: ConversationList,
  parameters: { layout: "padded" },
  args: { onSelect: fn(), items: mockConversations },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, background: "var(--color-panel)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActive: Story = {
  args: { activeId: mockConversations[0].id },
};

export const Empty: Story = {
  args: { items: [], emptyLabel: "Không tìm thấy kết quả." },
};
