"use client";

import React from "react";

export interface ChatActionButton {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ChatApprovalButtonsProps {
  /** Danh sách nút inline dưới tin nhắn (kiểu Telegram) */
  buttons: ChatActionButton[];
  /** Nếu có → ẩn nút, hiện badge trạng thái (vd. đã duyệt) */
  statusText?: string | null;
  className?: string;
}

const BTN_CLASS =
  "w-full min-h-[38px] flex items-center justify-center gap-1.5 bg-white/70 backdrop-blur-[8px] border border-white/90 rounded-[10px] text-[#0ea5e9] text-sm font-medium px-4 py-1.5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all duration-200 ease-in-out cursor-pointer select-none outline-hidden hover:bg-white/85 active:scale-[0.99] active:bg-sky-50 active:border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

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
        <span className="text-xs text-teal-700/80 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/90 shadow-sm font-medium select-none animate-in fade-in duration-300">
          {statusText}
        </span>
      </div>
    );
  }

  if (buttons.length === 0) return null;

  return (
    <div className={`flex flex-col gap-[2px] mt-1.5 w-full ${className}`.trim()}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          type="button"
          onClick={btn.onClick}
          disabled={btn.disabled}
          className={BTN_CLASS}
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}
    </div>
  );
};
