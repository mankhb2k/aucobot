import { Avatar } from "./Avatar";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    name: { control: "text" },
    seed: { control: "text" },
  },
  args: {
    name: "Team TikTok",
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const SingleWord: Story = {
  args: { name: "Marketing" },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 320 }}>
      {[
        "Team TikTok",
        "Chiến dịch Tết",
        "Nội dung Facebook",
        "Spa Hương Sen",
        "Bất động sản Q1",
        "Shop thời trang",
        "Caption AI",
        "Lên lịch tuần",
      ].map((name, i) => (
        <Avatar key={name} name={name} seed={`conv-${i}`} size="lg" />
      ))}
    </div>
  ),
};
