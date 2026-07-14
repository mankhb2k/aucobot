"use client";

import { useState } from "react";
import { initialChats } from "@/lib/mockData";
import { ChatComposer } from "@/components/app/ChatComposer/ChatComposer";
import { ChatHeader } from "@/components/app/ChatHeader/ChatHeader";
import { ChatList } from "@/components/app/ChatList/ChatList";
import { ChatMessages } from "@/components/app/ChatMessages/ChatMessages";
import { UserInfo } from "@/components/app/ChatPanel/UserInfo/UserInfo";
import type { Chat, Message } from "@/types/chat";

export function TelegramAppShell() {
  const [activeChatId, setActiveChatId] = useState<string>(initialChats[0]?.id || "room_marketing");
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [chats, setChats] = useState<Chat[]>(initialChats);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Toggle notifications status
  const handleToggleNotifications = () => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return { ...c, notifications: !c.notifications };
        }
        return c;
      }),
    );
  };

  // Rename Chat Handler
  const handleRenameChat = () => {
    const newName = prompt(
      "Enter new name for the conversation:",
      activeChat.name,
    );
    if (newName && newName.trim()) {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChat.id) {
            return { ...c, name: newName.trim() };
          }
          return c;
        }),
      );
    }
  };

  // Archive Chat Handler
  const handleArchiveChat = () => {
    alert(`Moved conversation "${activeChat.name}" to Archive.`);
    const remainingChats = chats.filter((c) => c.id !== activeChat.id);
    setChats(remainingChats);
    if (remainingChats.length > 0) {
      setActiveChatId(remainingChats[0].id);
    }
  };

  // Delete Chat Handler
  const handleDeleteChat = () => {
    if (
      confirm(
        `Are you sure you want to delete the conversation "${activeChat.name}"?`,
      )
    ) {
      const remainingChats = chats.filter((c) => c.id !== activeChat.id);
      setChats(remainingChats);
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      }
    }
  };

  // Send message handler
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      read: true,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      }),
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#e7ebf0] p-3 gap-3 overflow-hidden font-sans select-none" data-chat-shell>
      {/* ================= COLUMN 1: SIDEBAR (CHAT LIST) ================= */}
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

      {/* ================= COLUMN 2: CHAT CONTAINER ================= */}
      <div className="min-w-0 flex-1 chat-wallpaper rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
        <ChatHeader
          activeChat={activeChat}
          isRightPanelOpen={isRightPanelOpen}
          setIsRightPanelOpen={setIsRightPanelOpen}
          onRenameChat={handleRenameChat}
          onArchiveChat={handleArchiveChat}
          onDeleteChat={handleDeleteChat}
        />
        <ChatMessages
          messages={activeChat.messages}
          activeChatId={activeChatId}
        />
        <ChatComposer onSendMessage={handleSendMessage} />
      </div>

      {/* ================= COLUMN 3: USER INFO PANEL ================= */}
      <div
        className={`flex-shrink-0 overflow-hidden rounded-2xl shadow-xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.08)] transition-[width] duration-500 ease-in-out ${
          isRightPanelOpen
            ? "w-[22.5rem] lg:w-[28.125rem]"
            : "w-0 pointer-events-none"
        }`}
      >
        <div className="h-full w-[22.5rem] lg:w-[28.125rem]">
          <UserInfo
            activeChat={activeChat}
            setIsRightPanelOpen={setIsRightPanelOpen}
            onToggleNotifications={handleToggleNotifications}
          />
        </div>
      </div>
    </div>
  );
}
