import {
  Sparkles,
  FileText,
  Search,
  PenTool,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";
import { AgentActivity, type AgentActivityStep } from "./AgentActivity";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

const icon = (node: ReactNode) => node;

const workingSteps: AgentActivityStep[] = [
  {
    id: "1",
    label: "Phân tích yêu cầu",
    status: "done",
    icon: icon(<Sparkles className="h-3 w-3" />),
  },
  {
    id: "2",
    label: "Đọc brand kit Tết",
    detail: "3 tài liệu",
    status: "done",
    icon: icon(<FileText className="h-3 w-3" />),
  },
  {
    id: "3",
    label: "Tìm xu hướng caption Tết",
    detail: "12 kết quả",
    status: "running",
    icon: icon(<Search className="h-3 w-3" />),
  },
  {
    id: "4",
    label: "Soạn 3 caption + CTA",
    status: "pending",
    icon: icon(<PenTool className="h-3 w-3" />),
  },
  {
    id: "5",
    label: "Lên lịch đăng 09:00 ngày 28/1",
    status: "pending",
    icon: icon(<Clock className="h-3 w-3" />),
  },
  {
    id: "6",
    label: "Chuyển Publisher chuẩn bị đăng",
    status: "pending",
    icon: icon(<ArrowRight className="h-3 w-3" />),
  },
];

const doneSteps: AgentActivityStep[] = workingSteps.map((s) => ({
  ...s,
  status: "done" as const,
}));

const schedulingSteps: AgentActivityStep[] = [
  {
    id: "1",
    label: "Đồng bộ với hệ thống",
    status: "done",
    icon: icon(<Zap className="h-3 w-3" />),
  },
  {
    id: "2",
    label: "Đang thiết lập thời gian...",
    status: "running",
    icon: icon(<Clock className="h-3 w-3" />),
  },
];

const errorSteps: AgentActivityStep[] = [
  {
    id: "1",
    label: "Phân tích yêu cầu",
    status: "done",
    icon: icon(<Sparkles className="h-3 w-3" />),
  },
  {
    id: "2",
    label: "Kết nối Fanpage",
    detail: "OAuth hết hạn",
    status: "error",
    icon: icon(<FileText className="h-3 w-3" />),
  },
  {
    id: "3",
    label: "Đăng bài",
    status: "pending",
    icon: icon(<ArrowRight className="h-3 w-3" />),
  },
];

const meta: Meta<typeof AgentActivity> = {
  title: "App/AgentActivity",
  component: AgentActivity,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="min-h-[320px] rounded-2xl bg-gradient-to-br from-[#a4cbd6] via-[#d5e9bf] to-[#f6f0cf] p-6">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AgentActivity>;

/** Mockup giữa chừng — giống chat-simulator “Đang làm việc” */
export const Working: Story = {
  args: {
    state: "working",
    title: "Đang làm việc",
    steps: workingSteps,
    avatar: { text: "TL", bg: "bg-emerald-500" },
    showAvatar: true,
  },
};

/** Tất cả bước xong */
export const Done: Story = {
  args: {
    state: "done",
    title: "Đã hoàn thành",
    steps: doneSteps,
    avatar: { text: "TL", bg: "bg-emerald-500" },
  },
};

/** Sau khi duyệt lịch đăng — 2 bước */
export const Scheduling: Story = {
  args: {
    state: "working",
    title: "Đang xử lý",
    steps: schedulingSteps,
    avatar: { text: "TL", bg: "bg-emerald-500" },
  },
};

/** Có bước lỗi */
export const ErrorState: Story = {
  args: {
    state: "error",
    title: "Có lỗi xảy ra",
    steps: errorSteps,
    avatar: { text: "TL", bg: "bg-emerald-500" },
  },
};

/** Không hiện avatar (nhúng trong bubble khác) */
export const WithoutAvatar: Story = {
  args: {
    state: "working",
    title: "Đang làm việc",
    steps: workingSteps.slice(0, 3),
    showAvatar: false,
  },
};
