import { useState } from "react";

import { Switch } from "./Switch";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    defaultChecked: true,
    "aria-label": "Notifications",
  },
};

export const Unchecked: Story = {
  args: {
    defaultChecked: false,
    "aria-label": "Notifications",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    defaultChecked: true,
    "aria-label": "Small switch",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    "aria-label": "Disabled switch",
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [on, setOn] = useState(true);
    return (
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <Switch
          checked={on}
          onCheckedChange={(checked) => setOn(Boolean(checked))}
          aria-label="Notifications"
        />
        Notifications {on ? "ON" : "OFF"}
      </label>
    );
  },
};
