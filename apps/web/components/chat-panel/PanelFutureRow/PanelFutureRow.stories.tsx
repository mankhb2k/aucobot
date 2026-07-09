import { Bell, Cpu } from "lucide-react";

import { PanelFutureRow } from "./PanelFutureRow";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Chat Panel/PanelFutureRow",
  component: PanelFutureRow,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--color-surface)",
          padding: "var(--space-2)",
          width: "21rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelFutureRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  args: { icon: Bell, label: "Thông báo", trailing: "toggle" },
};

export const Badge: Story = {
  args: { icon: Cpu, label: "Agent trong phòng", trailing: "badge" },
};
