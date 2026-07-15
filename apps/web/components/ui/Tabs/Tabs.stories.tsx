import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[420px] rounded-2xl bg-[#e7ebf0] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

/** Capsule track — User Info (Media / Files / …) */
export const Capsule: Story = {
  render: function CapsuleStory() {
    const [value, setValue] = useState("media");
    return (
      <Tabs value={value} onValueChange={setValue} variant="capsule">
        <TabsList>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
        </TabsList>
        <TabsContent value="media" className="mt-3 text-sm text-gray-600">
          Media content
        </TabsContent>
        <TabsContent value="files" className="mt-3 text-sm text-gray-600">
          Files content
        </TabsContent>
        <TabsContent value="links" className="mt-3 text-sm text-gray-600">
          Links content
        </TabsContent>
        <TabsContent value="music" className="mt-3 text-sm text-gray-600">
          Music content
        </TabsContent>
      </Tabs>
    );
  },
};

/** Pills — sidebar Tin nhắn / Agent / Workflow */
export const Pills: Story = {
  render: function PillsStory() {
    const [value, setValue] = useState("Tin nhắn");
    return (
      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <Tabs value={value} onValueChange={setValue} variant="pills">
          <TabsList>
            <TabsTrigger value="Tin nhắn">Tin nhắn</TabsTrigger>
            <TabsTrigger value="Agent">Agent</TabsTrigger>
            <TabsTrigger value="Workflow">Workflow</TabsTrigger>
          </TabsList>
          <TabsContent value="Tin nhắn" className="mt-3 text-sm text-gray-600">
            Inbox sessions
          </TabsContent>
          <TabsContent value="Agent" className="mt-3 text-sm text-gray-600">
            Agent directory
          </TabsContent>
          <TabsContent value="Workflow" className="mt-3 text-sm text-gray-600">
            Workflow list
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};

export const ManyTriggersScroll: Story = {
  render: function ManyTriggersStory() {
    const items = ["All", "Unread", "Groups", "Channels", "Bots", "Archived", "Muted"];
    const [value, setValue] = useState(items[0]!);
    return (
      <Tabs value={value} onValueChange={setValue} variant="capsule">
        <TabsList>
          {items.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  },
};
