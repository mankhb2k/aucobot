"use client";

import { useState, useEffect, useCallback } from "react";
import { initialChats } from "@/lib/mockData";
import { ChatComposer } from "@/components/app/ChatComposer/ChatComposer";
import { ChatHeader } from "@/components/app/ChatHeader/ChatHeader";
import { ChatList } from "@/components/app/ChatList/ChatList";
import { ChatMessages } from "@/components/app/ChatMessages/ChatMessages";
import { UserInfo } from "@/components/app/ChatPanel/UserInfo/UserInfo";
import { conversationsApi } from "@/lib/api/conversations";
import { mapConversationToChat } from "@/lib/conversations/map-conversation";
import type { Chat, Message } from "@/types/chat";
import type { CreateConversationInput } from "@aucobot/shared";

/** Agent + Workflow vẫn mock; Tin nhắn lấy từ API */
const MOCK_NON_CHAT = initialChats.filter(
  (c) => c.category === "agent" || c.category === "workflow",
);

const EMPTY_CHAT: Chat = {
  id: "",
  name: "Aucobot",
  status: "",
  notifications: true,
  messages: [],
  sharedMedia: [],
  category: "chat",
};

export function TelegramAppShell() {
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [chats, setChats] = useState<Chat[]>([...MOCK_NON_CHAT]);
  const [workflowViewMode, setWorkflowViewMode] = useState<"chat" | "diagram">("chat");
  const [listError, setListError] = useState<string | null>(null);

  const [approvedMessages, setApprovedMessages] = useState<Record<string, boolean>>({
    rm3: true,
  });

  const activeChat =
    chats.find((c) => c.id === activeChatId) ?? chats[0] ?? EMPTY_CHAT;

  // Load Tin nhắn từ API khi mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { items } = await conversationsApi.list();
        if (cancelled) return;
        const apiChats = items.map(mapConversationToChat);
        setChats([...apiChats, ...MOCK_NON_CHAT]);
        setListError(null);
        setActiveChatId((prev) => {
          if (
            prev &&
            (apiChats.some((c) => c.id === prev) ||
              MOCK_NON_CHAT.some((c) => c.id === prev))
          ) {
            return prev;
          }
          return apiChats[0]?.id ?? MOCK_NON_CHAT[0]?.id ?? "";
        });
      } catch (err) {
        if (cancelled) return;
        // Chưa login / API lỗi → giữ mock
        const mockChats = initialChats.filter((c) => c.category === "chat");
        setChats([...mockChats, ...MOCK_NON_CHAT]);
        setActiveChatId(mockChats[0]?.id ?? MOCK_NON_CHAT[0]?.id ?? "");
        setListError(
          err instanceof Error
            ? err.message
            : "Không tải được danh sách hội thoại",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setWorkflowViewMode("chat");
  }, [activeChatId]);

  const handleCreateConversation = useCallback(
    async (input: CreateConversationInput) => {
      const created = await conversationsApi.create(input);
      const chat = mapConversationToChat(created);
      setChats((prev) => [chat, ...prev.filter((c) => c.id !== chat.id)]);
      setActiveChatId(chat.id);
      setListError(null);
    },
    [],
  );

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

  const handleArchiveChat = () => {
    alert(`Moved conversation "${activeChat.name}" to Archive.`);
    const remainingChats = chats.filter((c) => c.id !== activeChat.id);
    setChats(remainingChats);
    if (remainingChats.length > 0) {
      setActiveChatId(remainingChats[0].id);
    }
  };

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
                  text: "Trợ Lý:\n\nCaption đăng Facebook:\n\nTết sum vầy bắt đầu từ món ngon… 🧧\n\nLên lịch 09:00 ngày 28/1 sau khi bạn duyệt giúp em nhé!",
                };
              }
              return m;
            }),
          };
        }
        return chat;
      }),
    );
  };

  const handleApproveMessage = (msgId: string) => {
    setApprovedMessages((prev) => ({ ...prev, [msgId]: true }));

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
        }),
      );
    }, 800);
  };

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
                  text: "Trợ Lý: Tuyệt vời! Tôi đã lên lịch thành công cho bài viết này vào lúc 09:00 ngày 28/1. 🚀",
                };
              }
              return m;
            }),
          };
        }
        return chat;
      }),
    );
  };

  const handleSendMessage = (text: string) => {
    if (!activeChat.id) return;

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
          }),
        );
      }, 1000);
    }
  };

  return (
    <div
      className="flex h-screen w-screen bg-[#e7ebf0] p-3 gap-3 overflow-hidden font-sans select-none"
      data-chat-shell
    >
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onCreateConversation={handleCreateConversation}
      />

      <div className="min-w-0 flex-1 chat-wallpaper rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
        {listError && (
          <div className="absolute top-16 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-amber-700 shadow-sm border border-amber-100">
            {listError} — đang dùng dữ liệu demo
          </div>
        )}
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
          onRejectMessage={() => alert("Đã từ chối đề xuất.")}
          onEditMessage={() => alert("Mở trình chỉnh sửa nội dung.")}
          onCompleteWorking={handleCompleteWorking}
          onCompleteScheduling={handleCompleteScheduling}
        />
        <ChatComposer
          onSendMessage={handleSendMessage}
          workflowViewMode={workflowViewMode}
          setWorkflowViewMode={setWorkflowViewMode}
        />
      </div>

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
