import { Smile, Paperclip, Send, Mic } from "lucide-react";
import React, { useState } from "react";
import { EmojiPicker } from "./EmojiPicker";

export interface ChatComposerProps {
  onSendMessage: (text: string) => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
    setIsEmojiPickerOpen(false); // Close emoji picker after sending
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 pb-4 pt-1.5 flex items-center gap-2 flex-shrink-0 z-10 bg-transparent relative">
      {/* Main text input pill */}
      <div className="flex-1 bg-white rounded-2xl flex items-center px-3 py-1 shadow-sm border border-gray-200/10 relative">
        <button
          type="button"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className={`text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-50 transition-colors ${
            isEmojiPickerOpen ? "text-[#3390ec] bg-[#e4efff]" : ""
          }`}
        >
          <Smile size={24} className="stroke-[1.8]" />
        </button>
        
        {isEmojiPickerOpen && (
          <EmojiPicker
            onSelectEmoji={(emoji) => setInputValue((prev) => prev + emoji)}
            onClose={() => setIsEmojiPickerOpen(false)}
          />
        )}

        <input
          type="text"
          placeholder="Message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-transparent border-none focus:outline-none px-2 py-2.5 text-lg text-gray-800 placeholder-gray-400"
        />
        <button className="text-gray-400 hover:text-gray-600 p-2.5 rounded-full hover:bg-gray-50 transition-colors transform -rotate-45">
          <Paperclip size={21} className="stroke-[1.8]" />
        </button>
      </div>

      {/* Standalone circular action button */}
      {inputValue.trim() ? (
        <button
          onClick={handleSendMessage}
          className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shadow-sm text-[#3390ec] hover:text-blue-600 flex-shrink-0 transition-all hover:scale-105"
        >
          <Send size={22} className="stroke-[2.2]" />
        </button>
      ) : (
        <button className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-600 flex-shrink-0 transition-all">
          <Mic size={24} className="stroke-[1.8]" />
        </button>
      )}
    </div>
  );
};
