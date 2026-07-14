import type { ConversationResponse } from "@aucobot/shared";
import type { Chat } from "@/types/chat";
import { avatarGradientByIndex } from "@/components/ui/Avatar/avatar-gradients";

function initialsFromTitle(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/** Hash ổn định từ id → chọn gradient trong bộ màu có sẵn (trông random, không đổi sau reload). */
function avatarBgFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return avatarGradientByIndex(hash);
}

/** Map API Conversation → UI Chat (tin nhắn tab). */
export function mapConversationToChat(c: ConversationResponse): Chat {
  return {
    id: c.id,
    name: c.title,
    status: c.type === "session" ? "Quick Assistant" : "Phòng",
    avatarText: initialsFromTitle(c.title),
    avatarBg: avatarBgFromId(c.id),
    notifications: true,
    messages: [],
    sharedMedia: [],
    category: "chat",
    description: c.description ?? undefined,
    conversationType: c.type,
  };
}
