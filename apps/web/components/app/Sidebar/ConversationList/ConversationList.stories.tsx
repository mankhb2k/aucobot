import { fn } from "storybook/test";

import { mockConversations } from "@/mock/chat";

import { ConversationList } from "./ConversationList";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "App/ConversationList",
  component: ConversationList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { onSelect: fn(), items: mockConversations },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: "var(--sidebar-main-width)",
          height: 480,
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
