import { useState } from "react";

import { OtpInput } from "./OtpInput";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof OtpInput> = {
  title: "UI/OtpInput",
  component: OtpInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

function OtpDemo(props: {
  length?: number;
  showLabel?: boolean;
  disabled?: boolean;
  initial?: string;
}) {
  const length = props.length ?? 6;
  const [value, setValue] = useState(props.initial ?? "");
  const [completed, setCompleted] = useState<string | null>(null);

  return (
    <div className="flex w-[360px] flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <OtpInput
        value={value}
        onChange={setValue}
        length={length}
        label="Mã xác thực email"
        showLabel={props.showLabel}
        disabled={props.disabled}
        getDigitAriaLabel={(index, total) =>
          `Chữ số ${index + 1} trên ${total}`
        }
        onComplete={(code) => setCompleted(code)}
      />
      <p className="text-xs text-gray-500">
        {completed ? `Complete: ${completed}` : `Value: ${value || "—"}`}
      </p>
    </div>
  );
}

export const SixDigits: Story = {
  render: () => <OtpDemo length={6} />,
};

export const WithVisibleLabel: Story = {
  render: () => <OtpDemo length={6} showLabel />,
};

export const FourDigits: Story = {
  render: () => <OtpDemo length={4} />,
};

export const Prefilled: Story = {
  render: () => <OtpDemo length={6} initial="123456" />,
};

export const Disabled: Story = {
  render: () => <OtpDemo length={6} initial="12" disabled />,
};
