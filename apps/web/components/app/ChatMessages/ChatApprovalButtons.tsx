"use client";

import React from "react";

export interface ChatActionButton {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "approve" | "reject" | "edit" | "default";
}

interface ChatApprovalButtonsProps {
  /** Danh sách nút inline dưới tin nhắn (kiểu Telegram) */
  buttons: ChatActionButton[];
  /** Nếu có → ẩn nút, hiện badge trạng thái (vd. đã duyệt) */
  statusText?: string | null;
  className?: string;
}

const BASE_BTN_CLASS =
  "w-full min-h-[38px] flex items-center justify-center gap-1.5 bg-white/70 backdrop-blur-[8px] border border-white/90 rounded-[10px] text-[#0ea5e9] text-sm font-semibold px-4 py-1.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all duration-200 ease-in-out cursor-pointer select-none outline-hidden active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const VARIANT_CLASSES: Record<string, string> = {
  approve: "hover:bg-teal-50/80 hover:border-teal-200/90 hover:text-teal-600 active:bg-teal-100/90 active:border-teal-300",
  reject: "hover:bg-rose-50/80 hover:border-rose-200/90 hover:text-rose-600 active:bg-rose-100/90 active:border-rose-300",
  edit: "hover:bg-sky-50/80 hover:border-sky-200/90 hover:text-sky-600 active:bg-sky-100/90 active:border-sky-300",
  default: "hover:bg-white/85 active:bg-sky-50 active:border-sky-200"
};

/**
 * Bàn phím action dưới bubble chat — dùng chung cho duyệt bài, xem workflow, v.v.
 * Style glass kiểu Telegram inline button.
 */
export const ChatApprovalButtons: React.FC<ChatApprovalButtonsProps> = ({
  buttons,
  statusText,
  className = "",
}) => {
  if (statusText) {
    return (
      <div className={`flex justify-start mt-2 ${className}`.trim()}>
        <span className="text-xs text-teal-700 bg-teal-50/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-100/90 shadow-xs font-semibold select-none animate-in fade-in duration-300">
          {statusText}
        </span>
      </div>
    );
  }

  if (buttons.length === 0) return null;

  return (
    <div className={`flex flex-col gap-[2px] mt-1.5 w-full ${className}`.trim()}>
      {buttons.map((btn) => {
        const variantClass = VARIANT_CLASSES[btn.variant || "default"];
        return (
          <button
            key={btn.id}
            type="button"
            onClick={btn.onClick}
            disabled={btn.disabled}
            className={`${BASE_BTN_CLASS} ${variantClass}`}
          >
            {btn.icon}
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};
