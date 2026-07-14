import type { Chat } from "@/types/chat";

export interface WorkflowItem {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'success' | 'failed';
  lastRun: string;
  trigger: string;
  description: string;
}

export const initialWorkflows: WorkflowItem[] = [
  {
    id: "wf_1",
    name: "Tự động đăng bài Facebook Q1",
    status: "idle",
    lastRun: "10 phút trước",
    trigger: "Hàng ngày lúc 14:00",
    description: "Tự động soạn thảo nội dung PR và đăng bài viết hàng ngày lên Fanpage."
  },
  {
    id: "wf_2",
    name: "Quét tin nhắn Page & Báo cáo",
    status: "running",
    lastRun: "Đang chạy...",
    trigger: "Khi có tin nhắn mới",
    description: "Quét tin nhắn mới của Fanpage, tự động phản hồi và tổng hợp báo cáo."
  },
  {
    id: "wf_3",
    name: "Sync Affiliate Clip sang TikTok",
    status: "success",
    lastRun: "2 giờ trước",
    trigger: "Mỗi thứ Hai lúc 08:00",
    description: "Đồng bộ hóa video quảng cáo và tự động xuất bản lên kênh TikTok."
  },
  {
    id: "wf_4",
    name: "Theo dõi giá đối thủ & Cảnh báo",
    status: "success",
    lastRun: "Hôm qua lúc 18:00",
    trigger: "Hàng giờ",
    description: "Theo dõi giá sản phẩm của đối thủ cạnh tranh và gửi cảnh báo khi có thay đổi."
  }
];

export const initialChats: Chat[] = [
  // --- TIN NHẮN (ROOMS & SESSIONS) ---
  {
    id: "room_marketing",
    name: "Phòng Marketing Tổng Lực 🚀",
    status: "4 agents active",
    avatarText: "M",
    avatarBg: "bg-avatar-blue",
    notifications: true,
    category: "chat",
    messages: [
      {
        id: "rm1",
        sender: "them",
        text: "Hệ thống: Phòng Marketing Tổng Lực đã khởi tạo thành công.",
        time: "10:00",
        read: true
      },
      {
        id: "rm2",
        sender: "them",
        text: "CS Bot: Chào sếp, em đã kết nối API fanpage và sẵn sàng phản hồi khách hàng.",
        time: "10:02",
        read: true
      },
      {
        id: "rm3",
        sender: "them",
        text: "Content Creator AI: Em vừa soạn xong bài viết nháp về tính năng mới của sản phẩm. Sếp duyệt giúp em nhé!",
        time: "10:15",
        read: true
      },
      {
        id: "rm4",
        sender: "me",
        text: "Duyệt em nhé. Nội dung rất tốt! Hãy lên lịch đăng lên Page lúc 14:00 hôm nay.",
        time: "10:20",
        read: true
      },
      {
        id: "rm5",
        sender: "them",
        text: "Trợ Lý: @Content Creator AI Đã duyệt bài viết. @Publisher AI Bắt đầu lên lịch đăng bài lúc 14:00.",
        time: "10:21",
        read: true
      },
      {
        id: "rm6",
        sender: "them",
        text: "Publisher AI: Báo cáo sếp, em đã xếp lịch đăng bài thành công lên Facebook Graph API. ✅",
        time: "10:25",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "room_tiktok",
    name: "TikTok Video Campaign 🎬",
    status: "3 agents active",
    avatarText: "T",
    avatarBg: "bg-avatar-orange",
    notifications: true,
    category: "chat",
    messages: [
      {
        id: "rt1",
        sender: "them",
        text: "System: Khởi tạo phòng biên tập clip ngắn TikTok.",
        time: "Yesterday",
        read: true
      },
      {
        id: "rt2",
        sender: "them",
        text: "Designer AI: Em đã render xong ảnh bìa cho video review ngày hôm nay.",
        time: "Yesterday",
        read: true
      },
      {
        id: "rt3",
        sender: "them",
        text: "Publisher AI: Video review đã được đăng lên tài khoản TikTok Affiliate. Link click đang tăng mạnh ạ!",
        time: "Yesterday",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "session_translate",
    name: "Dịch thuật nhanh 💬",
    status: "Quick Assistant",
    avatarText: "QA",
    avatarBg: "bg-avatar-pink",
    notifications: false,
    category: "chat",
    messages: [
      {
        id: "st1",
        sender: "me",
        text: "Dịch giúp mình câu này sang tiếng Anh: 'Xây dựng phòng marketing ảo của riêng bạn'",
        time: "09:30",
        read: true
      },
      {
        id: "st2",
        sender: "them",
        text: "Quick Assistant: 'Build your own virtual marketing department.'",
        time: "09:31",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "session_copywriting",
    name: "Viết bài PR mẫu ✍️",
    status: "Quick Assistant",
    avatarText: "PR",
    avatarBg: "bg-avatar-green",
    notifications: false,
    category: "chat",
    messages: [
      {
        id: "sc1",
        sender: "me",
        text: "Gợi ý cho mình 3 tiêu đề giật gân bán khóa học AI.",
        time: "Friday",
        read: true
      },
      {
        id: "sc2",
        sender: "them",
        text: "Quick Assistant:\n1. 'Đừng để bị sa thải: Học AI hoặc bị thay thế trong 6 tháng tới!'\n2. 'Bí mật x10 hiệu suất làm việc bằng AI chỉ với 2 giờ học'\n3. 'Làm chủ AI ngay hôm nay: Kỹ năng bắt buộc để dẫn đầu năm 2026'",
        time: "Friday",
        read: true
      }
    ],
    sharedMedia: []
  },

  // --- AGENT TAB DMs ---
  {
    id: "mother",
    name: "Mother Agent 👑",
    status: "online",
    avatarText: "MA",
    avatarBg: "bg-avatar-purple",
    notifications: true,
    category: "agent",
    pinned: true,
    description: "Khởi tạo, cấu hình và quản lý các Agent trong hệ thống",
    messages: [
      {
        id: "mth1",
        sender: "them",
        text: "Chào sếp! Em là Mother Agent. Em chịu trách nhiệm khởi tạo, cấu hình và phân phối công việc cho các Agent khác trong phòng marketing. Sếp có muốn thiết lập thêm trợ lý mới nào không?",
        time: "13:38",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "agent_content",
    name: "Content Creator AI 📝",
    status: "last seen recently",
    avatarText: "CA",
    avatarBg: "bg-avatar-pink",
    notifications: false,
    category: "agent",
    description: "Chuyên viết copy, viết bài PR, biên dịch và sáng tạo nội dung",
    messages: [
      {
        id: "ac1",
        sender: "them",
        text: "Content Creator AI: Chào sếp, em chuyên viết copy, bài đăng social, bài PR và dịch thuật. Em có thể điều chỉnh văn phong theo yêu cầu của sếp.",
        time: "11:22",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "agent_designer",
    name: "Designer AI 🎨",
    status: "last seen recently",
    avatarText: "DA",
    avatarBg: "bg-avatar-blue",
    notifications: false,
    category: "agent",
    description: "Thiết kế banner, ảnh bìa, infographic và hình ảnh chiến dịch",
    messages: [
      {
        id: "ad1",
        sender: "them",
        text: "Designer AI: Em chuyên thiết kế banner, ảnh bìa, infographic và thumbnail Youtube bằng các model sinh ảnh tốt nhất. Sếp cần làm ấn phẩm gì ạ?",
        time: "10:15",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "agent_research",
    name: "Research AI 🔍",
    status: "online",
    avatarText: "RA",
    avatarBg: "bg-avatar-green",
    notifications: false,
    category: "agent",
    description: "Tìm kiếm web, đọc hiểu tài liệu và phân tích đối thủ cạnh tranh",
    messages: [
      {
        id: "ar1",
        sender: "them",
        text: "Research AI: Em hỗ trợ tìm kiếm web, tổng hợp tài liệu, phân tích đối thủ cạnh tranh và lập báo cáo. Hãy gửi từ khóa hoặc link tài liệu cho em nhé.",
        time: "Yesterday",
        read: true
      }
    ],
    sharedMedia: []
  },
  {
    id: "agent_publisher",
    name: "Publisher AI ✈️",
    status: "last seen recently",
    avatarText: "PA",
    avatarBg: "bg-avatar-orange",
    notifications: false,
    category: "agent",
    description: "Lên lịch đăng bài và tự động xuất bản lên Facebook/TikTok",
    messages: [
      {
        id: "ap1",
        sender: "them",
        text: "Publisher AI: Em kết nối trực tiếp với các kênh Facebook Page, TikTok Shop, Group và Telegram. Em sẽ lên lịch đăng bài và tự động xuất bản theo lệnh của sếp.",
        time: "Jul 12",
        read: true
      }
    ],
    sharedMedia: []
  }
];
