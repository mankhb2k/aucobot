import { Menu, Search, Plus, User, Bookmark, Users, Settings, MoreVertical, SquarePen, Moon, HelpCircle, Palette, Zap } from "lucide-react";
import React, { useState } from "react";
import { DropdownContent, DropdownItem, DropdownSeparator, DropdownSub, DropdownSubTrigger, DropdownSubContent } from "@/components/ui/Dropdown/Dropdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs/Tabs";
import { useDocumentTheme } from "@/hooks/theme/use-document-theme";
import { CreateConversationDialog } from "@/components/app/CreateConversationDialog/CreateConversationDialog";

import type { Chat } from "@/types/chat";
import { initialWorkflows } from "@/lib/mockData";
import { ChatItem } from "@/components/app/ChatItem/ChatItem";
import type { ThemeAppearance } from "@/utils/theme/resolve-document-theme";
import type { ConversationType, CreateConversationInput } from "@aucobot/shared";

export interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  /** Gọi API tạo session/room từ shell */
  onCreateConversation?: (input: CreateConversationInput) => Promise<void>;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  setActiveChatId,
  onCreateConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Tin nhắn");
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isPenMenuOpen, setIsPenMenuOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [appearance, setAppearance] = useState<ThemeAppearance>("system");
  const [createType, setCreateType] = useState<ConversationType | null>(null);

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
    <div className="relative w-[22.5rem] md:w-[23.75rem] bg-white rounded-2xl shadow-xl flex flex-col flex-shrink-0 overflow-hidden">
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
                onClick={() => {
                  setIsPenMenuOpen(false);
                  setCreateType("session");
                  setActiveTab("Tin nhắn");
                }}
              />
              <DropdownItem
                label="New Group"
                onClick={() => {
                  setIsPenMenuOpen(false);
                  setCreateType("room");
                  setActiveTab("Tin nhắn");
                }}
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
            .map((wf) => {
              const isSelected = wf.id === activeChatId;
              return (
                <div
                  key={wf.id}
                  onClick={() => setActiveChatId(wf.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all relative ${
                    isSelected 
                      ? "bg-blue-light text-gray-900" 
                      : "hover:bg-gray-100/70 bg-white text-gray-900"
                  }`}
                >
                  {/* Default Icon Avatar with Blue Gradient Background */}
                  <div className="w-[38px] h-[38px] rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white shadow-sm select-none">
                    <Zap size={18} className="fill-current text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-900 truncate pr-1">
                        {wf.name}
                      </h3>
                      <span
                        className={`text-sm whitespace-nowrap ${isSelected ? "text-blue font-medium" : "text-gray-400"}`}
                      >
                        {wf.lastRun}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 truncate pr-2 text-xs">
                        {wf.description}
                      </p>

                      {/* Status indicator: 2 states: run (green) vs stop (gray) */}
                      <div className="flex items-center flex-shrink-0 pl-1">
                        {wf.status === "running" ? (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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

      {onCreateConversation && (
        <CreateConversationDialog
          open={createType !== null}
          type={createType ?? "session"}
          onClose={() => setCreateType(null)}
          onSubmit={onCreateConversation}
        />
      )}
    </div>
  );
};
