import { X, Pen, Bell, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { PhoneIcon } from "@/components/app/icons/icons";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { Switch } from "@/components/ui/Switch/Switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs/Tabs";
import type { Chat } from "@/types/chat";

export interface UserInfoProps {
  activeChat: Chat;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  onToggleNotifications: () => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  activeChat,
  setIsRightPanelOpen,
  onToggleNotifications,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<string>("Media");
  const [scrollTop, setScrollTop] = useState<number>(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const isScrolled = scrollTop > 0;
  const isFullyScrolled = scrollTop >= 310;

  return (
    <div className="w-full h-full bg-[#f4f4f5] rounded-2xl flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div
        className={`h-14 px-4 flex items-center justify-between flex-shrink-0 bg-[#f4f4f5] transition-all duration-200 ${
          isScrolled && !isFullyScrolled
            ? "border-b border-gray-200/80 shadow-xs"
            : "border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRightPanelOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            {isFullyScrolled ? (
              <ArrowLeft size={20} className="stroke-[2.2]" />
            ) : (
              <X size={20} className="stroke-[2.2]" />
            )}
          </button>
          <h2 className="font-bold text-xl text-gray-900 transition-all duration-150">
            {isFullyScrolled ? activeMediaTab : "User Info"}
          </h2>
        </div>
        {!isFullyScrolled && (
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer">
            <Pen size={18} className="stroke-[2.2]" />
          </button>
        )}
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto thin-scrollbar pb-3"
      >
        {/* Large Avatar & Contact Name */}
        <div className="flex flex-col items-center pt-2 pb-6">
          <Avatar
            src={activeChat.avatarUrl}
            alt={activeChat.name}
            text={activeChat.avatarText}
            bg={activeChat.avatarBg}
            size="lg"
            className="shadow-sm mb-3.5"
          />
          <h2 className="font-bold text-2xl text-gray-900 text-center px-4 leading-tight">
            {activeChat.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeChat.status}
          </p>
        </div>

        {/* Main Details (Phone & Notifications) */}
        <div className="bg-white rounded-3xl mx-3 mb-3 shadow-sm overflow-hidden py-1">
          {/* Phone Details Row */}
          <div className="flex items-center gap-5 px-5 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
            <div className="flex-shrink-0">
              <PhoneIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">
                {activeChat.phone || "Hidden"}
              </p>
              <p className="text-sm text-gray-400 font-normal">Phone</p>
            </div>
          </div>

          {/* Notifications Row */}
          <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-5 flex-1">
              <div className="flex-shrink-0 text-gray-400">
                <Bell size={20} className="stroke-[2]" />
              </div>
              <span className="text-gray-800 font-medium">
                Notifications
              </span>
            </div>
            <Switch
              className="self-center"
              checked={activeChat.notifications}
              onCheckedChange={onToggleNotifications}
            />
          </div>
        </div>

        {/* Shared Content Sub-tabs (Sticky) */}
        <div className="sticky top-0 bg-[#f4f4f5] pt-1 pb-3 z-10">
          <Tabs
            value={activeMediaTab}
            onValueChange={setActiveMediaTab}
            variant="capsule"
            className="px-3"
          >
            <TabsList>
              <TabsTrigger value="Media">Media</TabsTrigger>
              <TabsTrigger value="Files">Files</TabsTrigger>
              <TabsTrigger value="Links">Links</TabsTrigger>
              <TabsTrigger value="Music">Music</TabsTrigger>
              <TabsTrigger value="GIF">GIF</TabsTrigger>
              <TabsTrigger value="Voice">Voice</TabsTrigger>
              <TabsTrigger value="Stories">Stories</TabsTrigger>
              <TabsTrigger value="Calls">Calls</TabsTrigger>
              <TabsTrigger value="Groups">Groups</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content Wrapper (Centralized Scroll height) */}
        <div className="min-h-[calc(100vh-100px)] flex flex-col">
          {activeMediaTab === "Media" ? (
            activeChat.sharedMedia && activeChat.sharedMedia.length > 0 ? (
              <div className="grid grid-cols-3 gap-[2px] px-3">
                {activeChat.sharedMedia.map((url, idx) => (
                  <div
                    key={url}
                    className="aspect-square relative bg-gray-100 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                  >
                    <Image
                      src={url}
                      alt={`Shared ${idx}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center flex-1 flex items-center justify-center text-gray-400 text-md">
                No shared media
              </div>
            )
          ) : (
            <div className="text-center flex-1 flex items-center justify-center text-gray-400 text-md">
              No shared {activeMediaTab.toLowerCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
