
import { useState } from "react";

import { fn } from "storybook/test";

import { SearchBar } from "./SearchBar";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Sidebar/SearchBar",
  component: SearchBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { value: "", onChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <SearchBar {...args} value={value} onChange={setValue} />;
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState("Tết");
    return <SearchBar {...args} value={value} onChange={setValue} />;
  },
};
