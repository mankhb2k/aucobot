import { buildAvatarProps } from "@/utils/avatar/build-avatar-props";
import { Avatar } from "./Avatar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const sampleAvatar = buildAvatarProps("Team TikTok", "conv-sample");

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    fallbackText: { control: "text" },
    backgroundColor: { control: "color" },
    alt: { control: "text" },
  },
  args: {
    ...sampleAvatar,
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const SingleWord: Story = {
  args: buildAvatarProps("Marketing", "marketing"),
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
        <Avatar
          key={name}
          {...buildAvatarProps(name, `conv-${i}`, { size: "lg" })}
        />
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    ...buildAvatarProps("Aucobot", "aucobot", {
      src: "https://api.dicebear.com/9.x/shapes/svg?seed=aucobot",
      decorative: false,
      imageFallbackDelayMs: 600,
    }),
  },
};
