import { Avatar, AVATAR_GRADIENT_KEYS } from "./Avatar";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    bg: {
      control: "select",
      options: [...AVATAR_GRADIENT_KEYS, "bg-avatar-deleted"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: {
    text: "AM",
    bg: "purple",
    size: "md",
    alt: "AucoMother",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar text="SM" bg="blue" size="sm" />
      <Avatar text="MD" bg="green" size="md" />
      <Avatar text="LG" bg="orange" size="lg" />
    </div>
  ),
};

export const GradientPalette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 max-w-[360px]">
      {AVATAR_GRADIENT_KEYS.map((key) => (
        <Avatar key={key} text={key.slice(0, 2).toUpperCase()} bg={key} size="md" />
      ))}
    </div>
  ),
};

/** Tài khoản đã xóa — ghost icon */
export const Deleted: Story = {
  args: {
    bg: "bg-avatar-deleted",
    size: "md",
    alt: "Deleted account",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=aucobot",
    alt: "User photo",
    size: "lg",
  },
};

export const Clickable: Story = {
  args: {
    text: "DE",
    bg: "red",
    size: "md",
    onClick: () => undefined,
  },
};
