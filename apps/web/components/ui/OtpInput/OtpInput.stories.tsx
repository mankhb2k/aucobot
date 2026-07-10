"use client";

import { useState } from "react";
import { fn } from "storybook/test";

import { OtpInput } from "./OtpInput";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const defaultDigitLabel = (index: number, total: number) =>
  `Digit ${index + 1} of ${total}`;

function OtpInputStory(
  props: Omit<React.ComponentProps<typeof OtpInput>, "value" | "onChange">,
) {
  const [value, setValue] = useState("");

  return (
    <OtpInput
      {...props}
      value={value}
      onChange={setValue}
    />
  );
}

const meta = {
  title: "UI/OtpInput",
  component: OtpInputStory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8, step: 1 } },
    label: { control: "text" },
    showLabel: { control: "boolean" },
    disabled: { control: "boolean" },
    onComplete: { action: "onComplete" },
  },
  args: {
    length: 6,
    label: "6-digit verification code",
    getDigitAriaLabel: defaultDigitLabel,
    showLabel: false,
    disabled: false,
    onComplete: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "360px",
          padding: "24px",
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OtpInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVisibleLabel: Story = {
  args: {
    showLabel: true,
    label: "Mã xác minh 6 số",
  },
};

export const FourDigits: Story = {
  args: {
    length: 4,
    label: "4-digit PIN",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Prefilled: Story = {
  render: (args) => {
    const [value, setValue] = useState("123456");
    return (
      <OtpInput
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
};
