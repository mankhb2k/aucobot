import {
  Search,
  MoreVertical,
  SquarePen,
  Archive,
  Video,
  BellOff,
  CheckCircle,
  Gift,
  Ban,
  Trash2,
  PanelRight,
} from "lucide-react";
import React, { useState } from "react";
import { DisableShareIcon } from "@/components/app/icons/icons";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown/Dropdown";
import type { Chat } from "@/types/chat";

export interface ChatHeaderProps {
  activeChat: Chat;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  onRenameChat: () => void;
  onArchiveChat: () => void;
  onDeleteChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeChat,
  isRightPanelOpen,
  setIsRightPanelOpen,
  onRenameChat,
  onArchiveChat,
  onDeleteChat,
}) => {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  return (
    <div className="w-[calc(100%-2rem)] max-w-[720px] mx-auto mt-3 mb-1 p-[4px] bg-white rounded-full shadow-sm flex items-center justify-between z-10 flex-shrink-0 relative select-none">
      {/* Identity info (Avatar + Text, no hover highlight) */}
      <div
        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
        onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
      >
        <Avatar
          src={activeChat.avatarUrl}
          alt={activeChat.name}
          text={activeChat.avatarText}
          bg={activeChat.avatarBg}
          size="sm"
        />
        <div className="flex flex-col min-w-0 gap-[1.5px] justify-center">
          <span className="font-bold text-base text-[#08060d] leading-none truncate">
            {activeChat.name}
          </span>
          <span className="text-xs text-[#6b6375] font-normal leading-none truncate">
            {activeChat.status}
          </span>
        </div>
      </div>

      {/* Actions group */}
      <div className="flex items-center gap-0.5 text-gray-400 relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            // Trigger search filter focus
          }}
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#08060d] active:bg-gray-200/60 flex-shrink-0 border-none cursor-pointer"
          aria-label="Tìm trong cuộc trò chuyện"
          title="Tìm kiếm"
        >
          <Search size={20} className="stroke-[2]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHeaderMenuOpen(!isHeaderMenuOpen);
          }}
          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all bg-transparent border-none cursor-pointer ${isHeaderMenuOpen ? "bg-gray-100 text-[#08060d]" : "text-gray-500 hover:bg-gray-100 hover:text-[#08060d] active:bg-gray-200/60"}`}
          aria-label="Tùy chọn"
        >
          <MoreVertical size={20} className="stroke-[2]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsRightPanelOpen(!isRightPanelOpen);
          }}
          className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all bg-transparent border-none cursor-pointer ${
            isRightPanelOpen
              ? "bg-[#e4efff] text-[#3390ec]"
              : "text-gray-500 hover:bg-gray-100 hover:text-[#08060d] active:bg-gray-200/60"
          }`}
          aria-label="Toggle User Info"
          title="Thông tin người dùng"
        >
          <PanelRight size={20} className="stroke-[2]" />
        </button>

        {/* Header Dropdown Menu */}
        <DropdownContent 
          isOpen={isHeaderMenuOpen} 
          onClose={() => setIsHeaderMenuOpen(false)}
        >
          <DropdownItem 
            icon={<SquarePen size={18} />} 
            label="Rename" 
            onClick={() => { setIsHeaderMenuOpen(false); onRenameChat(); }} 
          />
          <DropdownItem 
            icon={<Archive size={18} />} 
            label="Archive" 
            onClick={() => { setIsHeaderMenuOpen(false); onArchiveChat(); }} 
          />
          <DropdownItem icon={<Video size={18} />} label="Video Call" />
          <DropdownItem icon={<BellOff size={18} />} label="Mute" />
          <DropdownItem icon={<CheckCircle size={18} />} label="Select Messages" />
          <DropdownItem icon={<Gift size={18} />} label="Send Gift" />
          <DropdownItem icon={<DisableShareIcon className="w-[18px] h-[18px] text-gray-500 stroke-[2]" />} label="Disable Share" />
          <DropdownItem icon={<Ban size={18} />} label="Block User" />
          <DropdownSeparator />
          <DropdownItem 
            icon={<Trash2 size={18} />} 
            label="Delete Chat" 
            danger 
            onClick={() => { setIsHeaderMenuOpen(false); onDeleteChat(); }} 
          />
        </DropdownContent>
      </div>
    </div>
  );
};
