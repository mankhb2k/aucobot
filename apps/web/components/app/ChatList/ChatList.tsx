import { Menu, Search, Plus, User, Bookmark, Users, Settings, MoreVertical, SquarePen, Moon, HelpCircle, Palette, Zap } from "lucide-react";
import React, { useState } from "react";
import { DropdownContent, DropdownItem, DropdownSeparator, DropdownSub, DropdownSubTrigger, DropdownSubContent } from "@/components/ui/Dropdown/Dropdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs/Tabs";
import { useDocumentTheme } from "@/hooks/theme/use-document-theme";

import type { Chat } from "@/types/chat";
import { initialWorkflows } from "@/lib/mockData";
import { ChatItem } from "@/components/app/ChatItem/ChatItem";
import type { ThemeAppearance } from "@/utils/theme/resolve-document-theme";

export interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  setActiveChatId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Tin nhắn");
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isPenMenuOpen, setIsPenMenuOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [appearance, setAppearance] = useState<ThemeAppearance>("system");

  useDocumentTheme(appearance);

  function setThemeAppearance(next: ThemeAppearance) {
    setAppearance(next);
    if (next === "dark") {
      setIsNightMode(true);
      return;
    }
    if (next === "light") {
      setIsNightMode(false);
    }
  }

  function toggleNightMode() {
    const nextNightMode = !isNightMode;
    setIsNightMode(nextNightMode);
    setAppearance(nextNightMode ? "dark" : "light");
  }

  // Real-time Chat List Filtering
  const filteredChats = chats
    .filter((chat) => {
      const nameMatches = chat.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const messageMatches = chat.messages.some((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesQuery = nameMatches || messageMatches;

      if (activeTab === "Tin nhắn") {
        return matchesQuery && chat.category === "chat";
      }
      if (activeTab === "Agent") {
        return matchesQuery && chat.category === "agent";
      }

      return matchesQuery;
    })
    .sort((a, b) => {
      // Sort pinned items to the top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div className="w-[22.5rem] md:w-[23.75rem] bg-white rounded-2xl shadow-xl flex flex-col flex-shrink-0">
      {/* Top Header */}
      <div className="p-3 pb-2 flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsSidebarMenuOpen(!isSidebarMenuOpen)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${isSidebarMenuOpen ? "bg-gray-100 text-[#08060d]" : "text-gray-500 hover:bg-gray-100 hover:text-[#08060d]"}`}
            >
              <Menu size={20} className="stroke-[2.2]" />
            </button>
            <DropdownContent 
              isOpen={isSidebarMenuOpen} 
              onClose={() => setIsSidebarMenuOpen(false)}
              align="left"
            >
              <div className="px-3 py-2 flex items-center gap-3 mb-1 cursor-pointer hover:bg-black/5 rounded-xl transition-all">
                <div className="w-[34px] h-[34px] rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                   M
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-gray-900 truncate leading-none">mantv02</span>
                </div>
              </div>
              <DropdownSeparator />
              <DropdownItem icon={<Plus size={18} />} label="Add Account" />
              <DropdownSeparator />
              <DropdownItem icon={<User size={18} />} label="My Profile" />
              <DropdownItem icon={<Bookmark size={18} />} label="Saved Messages" />
              <DropdownItem icon={<Users size={18} />} label="Contacts" />
              <DropdownSub>
                <DropdownSubTrigger icon={<Palette size={18} />} label="Theme" />
                <DropdownSubContent>
                  <DropdownItem
                    label="System"
                    checked={appearance === "system"}
                    onClick={() => setThemeAppearance("system")}
                  />
                  <DropdownItem
                    label="Light"
                    checked={appearance === "light"}
                    onClick={() => setThemeAppearance("light")}
                  />
                  <DropdownItem
                    label="Dark"
                    checked={appearance === "dark"}
                    onClick={() => setThemeAppearance("dark")}
                  />
                </DropdownSubContent>
              </DropdownSub>
              <DropdownItem icon={<Settings size={18} />} label="Settings" />
              <DropdownSub>
                <DropdownSubTrigger icon={<MoreVertical size={18} />} label="More" />
                <DropdownSubContent>
                  <DropdownItem
                    icon={<Moon size={18} />}
                    label="Night Mode"
                    onClick={toggleNightMode}
                  />
                  <DropdownItem icon={<HelpCircle size={18} />} label="Help" />
                </DropdownSubContent>
              </DropdownSub>
            </DropdownContent>
          </div>
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f1f5f9] text-gray-800 rounded-full py-2 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3390ec] transition-all"
            />
          </div>
          {/* Action Pen Menu */}
          <div className="relative">
            <button
              onClick={() => setIsPenMenuOpen(!isPenMenuOpen)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
                isPenMenuOpen
                  ? "bg-gray-100 text-[#08060d]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-[#08060d]"
              }`}
              title="New Message"
            >
              <SquarePen size={20} className="stroke-[2.2]" />
            </button>
            <DropdownContent
              isOpen={isPenMenuOpen}
              onClose={() => setIsPenMenuOpen(false)}
              align="right"
            >
              <DropdownItem
                label="New Chat"
                onClick={() => setIsPenMenuOpen(false)}
              />
              <DropdownItem
                label="New Group"
                onClick={() => setIsPenMenuOpen(false)}
              />
            </DropdownContent>
          </div>
        </div>

        {/* Folder Tabs with Pill Styles */}
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
          <TabsList>
            <TabsTrigger value="Tin nhắn">Tin nhắn</TabsTrigger>
            <TabsTrigger value="Agent">Agent</TabsTrigger>
            <TabsTrigger value="Workflow">Workflow</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat List Scroll Container */}
      <div className="chat-scroll-view flex-1 thin-scrollbar pt-1.5 pb-3 mb-3 flex flex-col gap-0.5 mr-[3px] scrollbar-thin scrollbar-thumb-black/14 hover:scrollbar-thumb-black/26 active:scrollbar-thumb-black/8 scrollbar-track-transparent">
        {activeTab === "Workflow" ? (
          initialWorkflows
            .filter((wf) => wf.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((wf) => (
              <div
                key={wf.id}
                className="mx-3 my-1 p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:shadow-xs transition-all flex flex-col gap-1.5 select-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#e0f2fe] text-[#0ea5e9] rounded-lg">
                      <Zap size={14} className="fill-current text-[#0ea5e9]" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{wf.name}</span>
                  </div>
                  {/* Status indicator */}
                  <div className="flex items-center gap-1.5">
                    {wf.status === "running" && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                    {wf.status === "success" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    {wf.status === "idle" && (
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                    {wf.status === "failed" && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                    <span className="text-[10px] font-medium text-gray-500 capitalize">{wf.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>Trigger: {wf.trigger}</span>
                  <span>{wf.lastRun}</span>
                </div>
              </div>
            ))
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === activeChatId}
              onClick={() => setActiveChatId(chat.id)}
            />
          ))
        )}
        {activeTab !== "Workflow" && filteredChats.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Không tìm thấy cuộc trò chuyện nào
          </div>
        )}
        {activeTab === "Workflow" && initialWorkflows.filter((wf) => wf.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Không tìm thấy workflow nào
          </div>
        )}
      </div>
    </div>
  );
};
