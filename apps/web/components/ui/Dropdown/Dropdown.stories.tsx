import { useState } from "react";
import { Bookmark, Moon, Palette, Settings, User } from "lucide-react";

import {
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
} from "./Dropdown";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof DropdownContent> = {
  title: "UI/Dropdown",
  component: DropdownContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownContent>;

/**
 * `DropdownContent` dùng `absolute` + `top: 100%` → wrapper `relative`
 * phải ôm sát trigger (không bọc cả canvas).
 */
function DemoMenu({ align = "left" as const }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(true);
  const [appearance, setAppearance] = useState<"system" | "light" | "dark">(
    "system",
  );

  return (
    <div className="min-h-[280px] min-w-[280px] rounded-2xl bg-[#e7ebf0] p-8">
      <div className="relative inline-block">
        <button
          type="button"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <DropdownContent
          isOpen={open}
          onClose={() => setOpen(false)}
          align={align}
        >
          <DropdownItem icon={<User size={18} />} label="My Profile" />
          <DropdownItem icon={<Bookmark size={18} />} label="Saved Messages" />
          <DropdownSeparator />
          <DropdownSub>
            <DropdownSubTrigger icon={<Palette size={18} />} label="Theme" />
            <DropdownSubContent>
              <DropdownItem
                label="System"
                checked={appearance === "system"}
                onClick={() => setAppearance("system")}
              />
              <DropdownItem
                label="Light"
                checked={appearance === "light"}
                onClick={() => setAppearance("light")}
              />
              <DropdownItem
                label="Dark"
                checked={appearance === "dark"}
                onClick={() => setAppearance("dark")}
              />
            </DropdownSubContent>
          </DropdownSub>
          <DropdownItem icon={<Moon size={18} />} label="Night Mode" checked />
          <DropdownItem icon={<Settings size={18} />} label="Settings" />
          <DropdownSeparator />
          <DropdownItem label="Log out" danger />
        </DropdownContent>
      </div>
    </div>
  );
}

export const OpenMenu: Story = {
  render: () => <DemoMenu align="left" />,
};

export const AlignRight: Story = {
  render: () => <DemoMenu align="right" />,
};

export const NewMessageMenu: Story = {
  render: function NewMessageMenuStory() {
    const [open, setOpen] = useState(true);
    return (
      <div className="min-h-[200px] min-w-[240px] rounded-2xl bg-white p-8 shadow-sm">
        <div className="relative inline-block">
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-sm"
            onClick={() => setOpen((v) => !v)}
          >
            New
          </button>
          <DropdownContent
            isOpen={open}
            onClose={() => setOpen(false)}
            align="right"
          >
            <DropdownItem label="New Chat" />
            <DropdownItem label="New Group" />
            <DropdownItem label="New Agent" />
          </DropdownContent>
        </div>
      </div>
    );
  },
};
