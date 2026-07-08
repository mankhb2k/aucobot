import { useState } from "react";

import { MessageActionBlock } from "./MessageActionBlock";
import type { Message } from "@/types/chat";


import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const base: Message = {
  id: "ap1",
  conversationId: "conv-tet",
  senderType: "agent",
  senderName: "Trợ Lý",
  content:
    "Đã soạn **caption** đăng Facebook:\n\n*Tết sum vầy bắt đầu từ món ngon…* 🧧\n\nBạn duyệt trước khi lên lịch đăng nhé.",
  createdAt: new Date().toISOString(),
  approval: {
    requestId: "req-2841",
    status: "pending",
  },
};

const meta = {
  title: "Chat/MessageActionBlock",
  component: MessageActionBlock,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--chat-wallpaper)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "var(--space-4) 0",
          width: "40rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageActionBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    message: base,
    approval: base.approval!,
    showName: true,
    onAction: (id) => console.log("action", id),
  },
};

export const Approved: Story = {
  args: {
    message: base,
    approval: { ...base.approval!, status: "approved" },
    showName: true,
  },
};

export const Rejected: Story = {
  args: {
    message: base,
    approval: { ...base.approval!, status: "rejected" },
    showName: true,
  },
};

function InteractiveDemo() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [loading, setLoading] = useState<string | null>(null);

  function handleAction(actionId: string) {
    setLoading(actionId);
    setTimeout(() => {
      setLoading(null);
      setStatus(actionId === "approve" ? "approved" : "rejected");
    }, 900);
  }

  return (
    <MessageActionBlock
      message={base}
      approval={{ ...base.approval!, status }}
      showName
      onAction={status === "pending" ? handleAction : undefined}
      loadingActionId={loading}
    />
  );
}

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  args: {
    message: base,
    approval: base.approval!,
  },
  render: () => <InteractiveDemo />,
};
