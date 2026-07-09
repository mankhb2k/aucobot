"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

import styles from "./ToggleGroup.module.css";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const TEXT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "rooms", label: "Rooms" },
  { value: "sessions", label: "Sessions" },
] as const;

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["single", "multiple"] },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
    "aria-label": { control: "text", name: "aria-label" },
  },
  args: {
    type: "single",
    orientation: "horizontal",
    disabled: false,
    "aria-label": "Filter conversations",
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function TextToggleDemo({
  type,
  orientation,
  disabled,
  ariaLabel,
}: {
  type: "single" | "multiple";
  orientation: "horizontal" | "vertical";
  disabled?: boolean;
  ariaLabel: string;
}) {
  const [singleValue, setSingleValue] = useState("all");
  const [multipleValue, setMultipleValue] = useState<string[]>(["rooms"]);

  if (type === "multiple") {
    return (
      <ToggleGroup
        type="multiple"
        value={multipleValue}
        onValueChange={setMultipleValue}
        orientation={orientation}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {TEXT_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup
      type="single"
      value={singleValue}
      onValueChange={(value) => {
        if (value) setSingleValue(value);
      }}
      orientation={orientation}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {TEXT_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export const Single: Story = {
  render: (args) => (
    <TextToggleDemo
      type="single"
      orientation={args.orientation ?? "horizontal"}
      disabled={args.disabled}
      ariaLabel={args["aria-label"] ?? "Filter conversations"}
    />
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <TextToggleDemo
      type="multiple"
      orientation={args.orientation ?? "horizontal"}
      disabled={args.disabled}
      ariaLabel={args["aria-label"] ?? "Filter conversations"}
    />
  ),
};

function IconToggleDemo({ ariaLabel }: { ariaLabel: string }) {
  const [value, setValue] = useState("left");

  const ICON_OPTIONS = [
    { value: "left", label: "Align left", Icon: AlignLeft },
    { value: "center", label: "Align center", Icon: AlignCenter },
    { value: "right", label: "Align right", Icon: AlignRight },
  ] as const;

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) setValue(next);
      }}
      aria-label={ariaLabel}
    >
      {ICON_OPTIONS.map(({ value: itemValue, label, Icon }) => (
        <ToggleGroupItem key={itemValue} value={itemValue} aria-label={label}>
          <Icon className={styles.itemIcon} strokeWidth={2} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export const IconOnly: Story = {
  render: (args) => (
    <IconToggleDemo ariaLabel={args["aria-label"] ?? "Text alignment"} />
  ),
};

const SIX_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "rooms", label: "Phòng" },
  { value: "sessions", label: "Phiên" },
  { value: "agents", label: "Agent" },
  { value: "archived", label: "Lưu trữ" },
  { value: "pinned", label: "Ghim" },
] as const;

function ConstrainedWidthDemo({
  maxWidth,
  ariaLabel,
}: {
  maxWidth: number;
  ariaLabel: string;
}) {
  const [value, setValue] = useState<(typeof SIX_FILTER_OPTIONS)[number]["value"]>(
    "all",
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        padding: 16,
        background: "var(--color-panel)",
        border: "1px dashed var(--color-border)",
        borderRadius: 12,
      }}
    >
      <p
        style={{
          color: "var(--color-description)",
          fontSize: 12,
          marginBottom: 12,
        }}
      >
        Khung ngoài {maxWidth}px — 6 tab, chọn tab xa sẽ cuộn mượt vào giữa.
      </p>
      <ToggleGroup
        type="single"
        scrollable
        value={value}
        onValueChange={(next) => {
          if (next) setValue(next as (typeof SIX_FILTER_OPTIONS)[number]["value"]);
        }}
        aria-label={ariaLabel}
      >
        {SIX_FILTER_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export const SixItemsConstrained: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div style={{ width: "min(100%, 360px)" }}>
      <ConstrainedWidthDemo
        maxWidth={280}
        ariaLabel={args["aria-label"] ?? "Lọc hội thoại"}
      />
    </div>
  ),
};
