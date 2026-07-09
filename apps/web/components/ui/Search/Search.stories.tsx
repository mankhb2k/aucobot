import { useState } from "react";
import { Search } from "./Search";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Search",
  component: Search,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    clearAriaLabel: { control: "text" },
    value: { control: "text" },
  },
  args: {
    label: "Search conversations",
    placeholder: "Search...",
    clearAriaLabel: "Clear search",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "320px",
          padding: "20px",
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

function SearchWithState(props: React.ComponentProps<typeof Search>) {
  const [value, setValue] = useState("");
  return <Search {...props} value={value} onChangeValue={setValue} />;
}

export const Default: Story = {
  render: (args) => <SearchWithState {...args} />,
  args: {
    value: "",
    onChangeValue: () => undefined,
  },
};

export const WithVisibleLabel: Story = {
  render: (args) => <SearchWithState {...args} showLabel />,
  args: {
    value: "",
    onChangeValue: () => undefined,
  },
};
