import type { Conversation, Message } from "@/types/chat";
import type { ConversationResponse } from "@aucobot/shared";


/**
 * Dữ liệu giả cho tầng chat — dùng dựng UI và trong Storybook.
 * Thay bằng nguồn API thật sau mà không đụng component.
 */

const now = Date.now();
const minutes = (m: number) => new Date(now - m * 60_000).toISOString();
const hours = (h: number) => new Date(now - h * 3_600_000).toISOString();
const days = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const mockConversations: Conversation[] = [
  {
    id: "conv-tiktok",
    type: "room",
    title: "Team TikTok Q1",
    lastMessage: "Đã lên lịch 3 video cho tuần này.",
    lastMessageAt: minutes(2),
    unreadCount: 3,
  },
  {
    id: "conv-tet",
    type: "room",
    title: "Chiến dịch Tết 2026",
    lastMessage: "Content: caption mừng năm mới đã xong.",
    lastMessageAt: minutes(48),
    unreadCount: 0,
  },
  {
    id: "conv-caption",
    type: "session",
    title: "Soạn 5 caption Tết",
    lastMessage: "Bạn: viết thêm 2 caption ngắn hơn nhé",
    lastMessageAt: hours(3),
    unreadCount: 1,
  },
  {
    id: "conv-fb",
    type: "room",
    title: "Nội dung Facebook",
    lastMessage: "Publisher: bài đã đăng lúc 09:00.",
    lastMessageAt: hours(20),
    unreadCount: 0,
  },
  {
    id: "conv-report",
    type: "session",
    title: "Báo cáo tuần",
    lastMessage: "Tổng hợp engagement 7 ngày qua.",
    lastMessageAt: days(2),
    unreadCount: 0,
  },
  {
    id: "conv-spa",
    type: "room",
    title: "Spa Hương Sen",
    lastMessage: "Lên ý tưởng ưu đãi cuối tuần.",
    lastMessageAt: days(5),
    unreadCount: 0,
  },
];

/** Chi tiết hội thoại (contract API) — dùng cho panel thông tin. */
export const mockRoomDetail: ConversationResponse = {
  id: "conv-tiktok",
  type: "room",
  title: "Team TikTok Q1",
  description:
    "Không gian làm việc chung cho chiến dịch TikTok quý 1 — lên ý tưởng, viết kịch bản và lên lịch đăng video.",
  lastMessageAt: minutes(2),
  createdAt: days(12),
  updatedAt: minutes(2),
};

export const mockSessionDetail: ConversationResponse = {
  id: "conv-caption",
  type: "session",
  title: "Soạn 5 caption Tết",
  description: null,
  lastMessageAt: hours(3),
  createdAt: hours(5),
  updatedAt: hours(3),
};

export const mockMessages: Message[] = [
  {
    id: "m1",
    conversationId: "conv-tiktok",
    senderType: "user",
    senderName: "Bạn",
    content: "Chào team, tuần này mình cần 3 video ngắn về sản phẩm mới.",
    createdAt: minutes(30),
  },
  {
    id: "m2",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Content",
    content: "Đã ghi nhận. Mình sẽ viết kịch bản cho 3 video theo brand kit.",
    createdAt: minutes(28),
  },
  {
    id: "m3",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Scheduler",
    content: "Đã lên lịch 3 video cho tuần này.",
    createdAt: minutes(2),
  },
];

/** Luồng hội thoại đầy đủ (nhiều ngày, markdown, system) cho MessageList/ChatArea. */
export const mockThreadMessages: Message[] = [
  {
    id: "t0",
    conversationId: "conv-tiktok",
    senderType: "system",
    senderName: "",
    content: "Phòng đã được tạo.",
    createdAt: days(1),
  },
  {
    id: "t1",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Content",
    content: "Chào bạn 👋 Mình là trợ lý Content, sẵn sàng hỗ trợ marketing.",
    createdAt: days(1),
  },
  {
    id: "t2",
    conversationId: "conv-tiktok",
    senderType: "user",
    senderName: "Bạn",
    content: "Viết giúp mình 5 caption Tết theo brand kit nhé.",
    createdAt: minutes(58),
  },
  {
    id: "t3",
    conversationId: "conv-tiktok",
    senderType: "user",
    senderName: "Bạn",
    content: "Giọng ấm áp, hướng tới gia đình.",
    createdAt: minutes(57),
  },
  {
    id: "t4",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Content",
    content:
      "Tuyệt vời! Đây là **3 caption** đầu tiên:\n\n1. Tết này, sum vầy bên nhau 🧧\n2. Gói trọn yêu thương, trao ngày đầu năm\n3. Năm mới an khang — khởi đầu như ý\n\nBạn muốn mình viết tiếp 2 caption nữa không?",
    createdAt: minutes(56),
  },
  {
    id: "t5",
    conversationId: "conv-tiktok",
    senderType: "user",
    senderName: "Bạn",
    content: "Có, và thêm hashtag nhé.",
    createdAt: minutes(3),
  },
  {
    id: "t6",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Content",
    content:
      "Đã thêm 2 caption + hashtag:\n\n4. Xuân về, rộn ràng tiếng cười `#Tet2026`\n5. Trao lộc đầu năm, đón vạn điều may `#TetSumVay`\n\nXem hướng dẫn đăng lịch ở [đây](/app).",
    createdAt: minutes(2),
  },
  {
    id: "t7",
    conversationId: "conv-tiktok",
    senderType: "agent",
    senderName: "Trợ Lý",
    content:
      "Caption đăng Facebook:\n\n**Tết sum vầy bắt đầu từ món ngon…** 🧧\n\nLên lịch **09:00 ngày 28/1** sau khi bạn duyệt.",
    createdAt: minutes(1),
    approval: {
      requestId: "req-2841",
      status: "pending",
    },
  },
];
