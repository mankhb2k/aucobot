import React from "react";

/** Telegram-style typing bubble — 3 dots bounce. */
export function ChatTypingIndicator() {
  return (
    <div
      className="flex w-full mb-1.5 justify-start"
      role="status"
      aria-live="polite"
      aria-label="Agent đang nhập tin nhắn"
    >
      <div className="bg-white text-gray-900 rounded-2xl rounded-bl-[4px] shadow-xs px-3.5 py-3 select-none">
        <div className="flex items-center gap-1.5 h-[14px]">
          <span className="chat-typing-dot" />
          <span className="chat-typing-dot" style={{ animationDelay: "0.15s" }} />
          <span className="chat-typing-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    </div>
  );
}
