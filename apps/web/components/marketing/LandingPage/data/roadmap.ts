export type ItemStatus = "done" | "in-progress" | "planned";

export interface RoadmapItem {
  label: string;
  status: ItemStatus;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  tagline: string;
  items: RoadmapItem[];
}

/**
 * Nguồn sự thật duy nhất cho roadmap + progress (build-in-public).
 * GIỮ ĐÚNG trạng thái repo — số liệu bịa sẽ phá uy tín.
 */
export const ROADMAP: RoadmapPhase[] = [
  {
    id: "phase-1",
    name: "Phase 1 — Nền tảng",
    tagline: "Khung sản phẩm chạy được",
    items: [
      { label: "Xác thực (OTP email + Google)", status: "done" },
      { label: "Phòng Marketing (Room / Session)", status: "done" },
      { label: "Giao diện chat", status: "done" },
      { label: "Bật/tắt feature qua config", status: "done" },
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2 — AI & Kết nối",
    tagline: "Agent thật sự làm việc",
    items: [
      { label: "Tin nhắn & AI trả lời", status: "in-progress" },
      { label: "Duyệt bài (Human approval)", status: "planned" },
      { label: "Facebook", status: "planned" },
      { label: "TikTok", status: "planned" },
    ],
  },
  {
    id: "phase-3",
    name: "Phase 3 — Tự động hóa",
    tagline: "Chạy thay bạn",
    items: [
      { label: "Lên lịch & đăng bài tự động", status: "planned" },
      { label: "Bot / Workflow (Agent xây hộ)", status: "planned" },
      { label: "Long-term memory thương hiệu", status: "planned" },
    ],
  },
  {
    id: "phase-4",
    name: "Phase 4 — Mở rộng",
    tagline: "Super app cộng tác",
    items: [
      { label: "Mời đồng nghiệp + phân quyền", status: "planned" },
      { label: "Marketplace agent", status: "planned" },
      { label: "Community agent", status: "planned" },
    ],
  },
];

export const STATUS_LABEL: Record<ItemStatus, string> = {
  done: "Xong",
  "in-progress": "Đang làm",
  planned: "Dự kiến",
};

/** % hoàn thành MVP = (done) / (tất cả item Phase 1 + Phase 2). Tính từ data, không hardcode. */
export function mvpProgressPercent(): number {
  const mvpItems = ROADMAP.filter(
    (phase) => phase.id === "phase-1" || phase.id === "phase-2",
  ).flatMap((phase) => phase.items);

  if (mvpItems.length === 0) {
    return 0;
  }

  const done = mvpItems.filter((item) => item.status === "done").length;

  return Math.round((done / mvpItems.length) * 100);
}

/** Sprint hiện tại — item đang làm (build-in-public "current focus"). */
export const CURRENT_SPRINT: string[] = [
  "Tin nhắn & AI trả lời (LLM vào chat)",
  "Chuẩn bị Facebook OAuth",
];

/** Cập nhật thủ công khi có mốc mới. */
export const LAST_UPDATED = "2 Tháng 7, 2026";

export interface TimelineStage {
  label: string;
  reached: boolean;
  current?: boolean;
}

export const DEMO_TIMELINE: TimelineStage[] = [
  { label: "Ý tưởng", reached: true },
  { label: "Kiến trúc", reached: true },
  { label: "MVP", reached: true, current: true },
  { label: "Private Alpha", reached: false },
  { label: "Closed Beta", reached: false },
  { label: "Public Beta", reached: false },
  { label: "Ra mắt", reached: false },
];
