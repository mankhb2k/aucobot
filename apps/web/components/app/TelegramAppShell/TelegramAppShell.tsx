"use client";

import { useState, useEffect } from "react";
import { initialChats } from "@/lib/mockData";
import { ChatComposer } from "@/components/app/ChatComposer/ChatComposer";
import { ChatHeader } from "@/components/app/ChatHeader/ChatHeader";
import { ChatList } from "@/components/app/ChatList/ChatList";
import { ChatMessages } from "@/components/app/ChatMessages/ChatMessages";
import { UserInfo } from "@/components/app/ChatPanel/UserInfo/UserInfo";
import type { Chat, Message } from "@/types/chat";

export function TelegramAppShell() {
  const [activeChatId, setActiveChatId] = useState<string>("room_marketing");
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [workflowViewMode, setWorkflowViewMode] = useState<"chat" | "diagram">("chat");

  const [approvedMessages, setApprovedMessages] = useState<Record<string, boolean>>({
    // rm3 đã duyệt trong lịch sử; rm8 đang chờ duyệt (hiện nút Duyệt / Từ chối / Sửa)
    rm3: true,
  });

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    setWorkflowViewMode("chat");
  }, [activeChatId]);

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

  // Complete working step simulation
  const handleCompleteWorking = (msgId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (m.id === msgId) {
                return {
                  ...m,
                  text: "Trợ Lý:\n\nCaption đăng Facebook:\n\nTết sum vầy bắt đầu từ món ngon… 🧧\n\nLên lịch 09:00 ngày 28/1 sau khi bạn duyệt giúp em nhé!"
                };
              }
              return m;
            })
          };
        }
        return chat;
      })
    );
  };

  // Approve action simulator
  const handleApproveMessage = (msgId: string) => {
    setApprovedMessages((prev) => ({ ...prev, [msgId]: true }));
    
    // Trigger follow-up scheduling progress
    setTimeout(() => {
      const scheduleMsgId = "sched_" + Date.now();
      const progressMsg: Message = {
        id: scheduleMsgId,
        sender: "them",
        text: "[PROGRESS_SCHEDULING]",
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
              messages: [...chat.messages, progressMsg],
            };
          }
          return chat;
        })
      );
    }, 800);
  };

  // Complete scheduling step simulation
  const handleCompleteScheduling = (msgId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (m.id === msgId) {
                return {
                  ...m,
                  text: "Trợ Lý: Tuyệt vời! Tôi đã lên lịch thành công cho bài viết này vào lúc 09:00 ngày 28/1. 🚀"
                };
              }
              return m;
            })
          };
        }
        return chat;
      })
    );
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
      })
    );

    // Trigger mock response if message tags Trợ Lý
    if (text.includes("@Trợ Lý")) {
      setTimeout(() => {
        const workingMsgId = "work_" + Date.now();
        const workingMsg: Message = {
          id: workingMsgId,
          sender: "them",
          text: "[PROGRESS_WORKING]",
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
                messages: [...chat.messages, workingMsg],
              };
            }
            return chat;
          })
        );
      }, 1000);
    }
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
          workflowViewMode={workflowViewMode}
          setWorkflowViewMode={setWorkflowViewMode}
        />
        <ChatMessages
          messages={activeChat.messages}
          activeChatId={activeChatId}
          workflowViewMode={workflowViewMode}
          setWorkflowViewMode={setWorkflowViewMode}
          approvedMessages={approvedMessages}
          onApproveMessage={handleApproveMessage}
          onRejectMessage={(msgId) => alert("Đã từ chối đề xuất.")}
          onEditMessage={(msgId) => alert("Mở trình chỉnh sửa nội dung.")}
          onCompleteWorking={handleCompleteWorking}
          onCompleteScheduling={handleCompleteScheduling}
        />
        <ChatComposer 
          onSendMessage={handleSendMessage} 
          workflowViewMode={workflowViewMode}
          setWorkflowViewMode={setWorkflowViewMode}
        />
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
