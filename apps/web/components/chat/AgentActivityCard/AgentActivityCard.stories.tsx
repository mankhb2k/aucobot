import { useEffect, useState } from "react";

import { AgentActivityCard } from "./AgentActivityCard";
import type { AgentActivity } from "@/types/chat";


import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat/AgentActivityCard",
  component: AgentActivityCard,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-chat)",
          padding: "var(--space-4) 0",
          width: "40rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentActivityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Kịch bản workflow marketing đầy đủ (dùng cho demo). */
const SCRIPT: AgentActivity[] = [
  { id: "s1", kind: "thinking", label: "Phân tích yêu cầu", status: "done" },
  {
    id: "s2",
    kind: "web_search",
    label: "Tìm xu hướng Tết trên TikTok",
    status: "done",
    detail: "12 kết quả",
  },
  {
    id: "s3",
    kind: "read_document",
    label: "Đọc brand kit",
    status: "done",
    detail: "3 tài liệu",
  },
  { id: "s4", kind: "write_content", label: "Soạn 5 caption", status: "done" },
  {
    id: "s5",
    kind: "schedule",
    label: "Lên lịch đăng 09:00",
    status: "running",
  },
  {
    id: "s6",
    kind: "handoff",
    label: "Chuyển Publisher đăng bài",
    status: "running",
  },
];

export const Running: Story = {
  args: {
    activities: [
      { id: "a1", kind: "web_search", label: "Đang tìm kiếm web", status: "running" },
    ],
  },
};

export const Workflow: Story = {
  args: {
    activities: SCRIPT.slice(0, 5),
  },
};

export const WithError: Story = {
  args: {
    activities: [
      { id: "a1", kind: "write_content", label: "Soạn caption", status: "done" },
      { id: "a2", kind: "publish", label: "Đăng Facebook", status: "error", detail: "Hết hạn token" },
    ],
  },
};

/** Demo tiến trình chạy liên tục — từng bước lần lượt done rồi bước kế running. */
function LiveDemo() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= SCRIPT.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 1200);
    return () => clearTimeout(t);
  }, [count]);

  const activities: AgentActivity[] = SCRIPT.slice(0, count).map((a, i) => ({
    ...a,
    status: i === count - 1 && count < SCRIPT.length ? "running" : "done",
  }));

  return <AgentActivityCard activities={activities} />;
}

export const LiveProgress: Story = {
  parameters: { controls: { disable: true } },
  args: { activities: [] },
  render: () => <LiveDemo />,
};
