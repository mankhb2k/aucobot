import { StatusBadge } from "./StatusBadge";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    ok: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    ok: true,
    label: "Connected",
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    ok: true,
    label: "Connected",
  },
};

export const Error: Story = {
  args: {
    ok: false,
    label: "Offline",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <StatusBadge ok label="Online" />
      <StatusBadge ok={false} label="Offline" />
      <StatusBadge ok label="Verified" />
      <StatusBadge ok={false} label="Failed" />
    </div>
  ),
};
