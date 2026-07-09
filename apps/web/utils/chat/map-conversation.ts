import type { Conversation } from "@/types/chat";
import type { ConversationResponse } from "@aucobot/shared";

/** Map API conversation → sidebar row (preview tạm khi chưa có message API). */
export function mapConversationToSidebarItem(
  item: ConversationResponse,
): Conversation {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    lastMessage: item.description?.trim() || "Chưa có tin nhắn",
    lastMessageAt: item.lastMessageAt ?? item.createdAt,
    unreadCount: 0,
  };
}
