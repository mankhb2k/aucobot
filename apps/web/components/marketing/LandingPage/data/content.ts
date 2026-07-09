export interface FeatureCard {
  title: string;
  body: string;
}

export const FEATURES: FeatureCard[] = [
  {
    title: "Dựng phòng marketing AI trong vài phút",
    body: "Tạo một không gian làm việc, mô tả thương hiệu — phần còn lại để AI lo.",
  },
  {
    title: "Kết nối công cụ của bạn",
    body: "Facebook, TikTok, Google Drive, Notion — nối một lần, dùng mọi nơi.",
  },
  {
    title: "Nhiều AI phối hợp như một team",
    body: "Không phải một chatbot đơn lẻ. Content, Research, Publisher làm việc cùng nhau.",
  },
  {
    title: "Bạn luôn duyệt cuối",
    body: "AI không tự ý đăng. Mọi bài đều chờ bạn duyệt trước khi lên sóng.",
  },
  {
    title: "AI nhớ thương hiệu của bạn",
    body: "Tone giọng, quy tắc, ngành hàng — ghi nhớ lâu dài, không lặp lại mỗi lần.",
  },
  {
    title: "Tự tạo agent của riêng bạn",
    body: "Thiết kế các Agent chuyên trách bằng cách tùy chỉnh hướng dẫn, giọng điệu và giao việc cụ thể phù hợp với chiến dịch của bạn.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "AI có tự đăng bài không?",
    answer:
      "Không. AI chỉ soạn nội dung và đề xuất. Bạn luôn là người duyệt cuối trước khi bất kỳ bài nào được đăng.",
  },
  {
    question: "Có hỗ trợ TikTok không?",
    answer:
      "Có trong lộ trình (Phase 2). Facebook và TikTok là hai nền tảng đầu tiên được tích hợp.",
  },
  {
    question: "Có miễn phí không?",
    answer:
      "Giai đoạn đầu ưu tiên người trong waitlist trải nghiệm sớm. Chính sách giá sẽ công bố khi mở beta.",
  },
  {
    question: "Khi nào mở beta?",
    answer:
      "Chúng tôi build in public — theo dõi tiến độ ngay trên trang này. Đăng ký nhận thông báo để là người đầu tiên được mời.",
  },
];

export interface CommunityLink {
  label: string;
  href: string;
  external: boolean;
  ready: boolean;
}

/**
 * Link cộng đồng. `ready: false` → hiển thị dạng "sắp có" (disabled),
 * chưa có kênh thật thì không dẫn link chết.
 */
export const COMMUNITY_LINKS: CommunityLink[] = [
  { label: "Discord", href: "#", external: true, ready: false },
  { label: "X (Twitter)", href: "#", external: true, ready: false },
  { label: "GitHub", href: "#", external: true, ready: false },
  { label: "Build in Public", href: "#buildinpublic", external: false, ready: true },
];
