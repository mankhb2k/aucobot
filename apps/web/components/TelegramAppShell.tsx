"use client";

import { useState } from "react";
import { initialChats } from "@/lib/mockData";
import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { UserInfo } from "./UserInfo";
import type { Chat, Message } from "@/types/chat";

export function TelegramAppShell() {
  const [activeChatId, setActiveChatId] = useState<string>("van_chay");
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
      {/* Styles for custom backgrounds and bubbles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .chat-wallpaper {
          background-color: #95c391;
          background-image: url("/telegram-doodle.svg");
          background-size: 375px 812px;
          background-repeat: repeat;
        }
      `,
        }}
      />

      {/* ================= COLUMN 1: SIDEBAR (CHAT LIST) ================= */}
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />

      {/* ================= COLUMN 2: CHAT CONTAINER ================= */}
      <div className="flex-1 chat-wallpaper rounded-2xl shadow-xl flex flex-col overflow-hidden min-w-0 relative transition-all duration-300 ease-in-out">
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
        className={`transition-all duration-300 ease-in-out flex flex-shrink-0 overflow-hidden rounded-2xl ${
          isRightPanelOpen
            ? "w-[22.5rem] lg:w-[28.125rem] opacity-100 shadow-xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.08)]"
            : "w-0 opacity-0 pointer-events-none -ml-3 shadow-none"
        }`}
      >
        <UserInfo
          activeChat={activeChat}
          setIsRightPanelOpen={setIsRightPanelOpen}
          onToggleNotifications={handleToggleNotifications}
        />
      </div>
    </div>
  );
}
