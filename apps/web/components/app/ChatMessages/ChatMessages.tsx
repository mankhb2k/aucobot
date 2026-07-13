import React, { useRef, useEffect } from "react";
import { isEmojiOnly } from "@/lib/telegramUtils";
import { AnimatedEmoji } from "@/components/app/AnimatedEmoji/AnimatedEmoji";
import { DoubleCheck, SingleCheck } from "@/components/app/icons/icons";
import emojiListMap from "./emoji-list.json";
import type { Message } from "@/types/chat";

const LOCAL_EMOJIS = new Set(Object.keys(emojiListMap));

export interface ChatMessagesProps {
  messages: Message[];
  activeChatId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  activeChatId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatId, messages]);

  return (
    <div className="flex-1 bg-transparent -mt-[64px] -mb-[68px] pt-[64px] pb-[68px] px-4 flex flex-col overflow-y-auto min-h-0 chat-fade-mask">
      <div className="w-full max-w-[720px] mx-auto flex flex-col gap-2 mt-auto">
        {messages.map((message) => {
          const isMe = message.sender === "me";
          const isSingleEmoji = isEmojiOnly(message.text);

          if (isSingleEmoji) {
            const trimmedText = message.text.trim();
            const emojis = Array.from(trimmedText.replace(/\s+/g, ""));
            const canAnimateAll =
              emojis.length > 0 &&
              emojis.every((emoji) => LOCAL_EMOJIS.has(emoji));

            const emojiItems = emojis.map((emoji, idx) => {
              const relativePath =
                emojiListMap[emoji as keyof typeof emojiListMap] || "";
              return {
                emoji,
                key: `${message.id}-${idx}`,
                localPath: `/emoji/${relativePath}`,
              };
            });

            return (
              <div
                key={message.id}
                className={`flex w-full mb-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="relative group max-w-[70%] select-text">
                  {canAnimateAll ? (
                    <div className="flex gap-1.5 items-center">
                      {emojiItems.map((item) => (
                        <AnimatedEmoji
                          key={item.key}
                          src={item.localPath}
                          alt={item.emoji}
                          className="w-14 h-14 object-contain filter drop-shadow-sm select-none"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-emoji leading-tight select-all filter drop-shadow-sm">
                      {message.text}
                    </span>
                  )}

                  {/* Sub-label time overlay */}
                  <span className="absolute -bottom-1 -right-8 bg-black/35 backdrop-blur-xs text-white text-xs px-1.5 py-0.5 rounded-full select-none font-medium flex items-center gap-0.5">
                    {message.time}
                    {isMe &&
                      (message.read ? (
                        <DoubleCheck className="text-white w-3 h-3" />
                      ) : (
                        <SingleCheck className="text-white w-3 h-3" />
                      ))}
                  </span>
                </div>
              </div>
            );
          }

          const metaClassName = `absolute bottom-[4px] right-[7px] flex items-center gap-0.5 text-[11px] leading-none select-none pointer-events-none ${
            isMe ? "text-[#6c9c63]" : "text-gray-400"
          }`;

          return (
            <div
              key={message.id}
              className={`flex w-full mb-0.5 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative w-fit max-w-[75%] shadow-xs select-text px-[9px] pt-[5px] pb-[5px]
                  ${
                    isMe
                      ? "bg-[#eeffde] text-gray-900 rounded-2xl rounded-br-[4px]"
                      : "bg-white text-gray-900 rounded-2xl rounded-bl-[4px]"
                  }`}
              >
                <div className="leading-[1.3125] whitespace-pre-wrap break-words">
                  {message.text}
                  {/* Reserve bottom-right corner so meta never overlaps text */}
                  <span
                    aria-hidden
                    className="inline-block w-[48px] h-[1.15em] align-bottom ml-1 pointer-events-none select-none"
                  />
                </div>

                <span className={metaClassName}>
                  <span>{message.time}</span>
                  {isMe &&
                    (message.read ? (
                      <DoubleCheck className="text-[#6c9c63] w-[13px] h-[13px]" />
                    ) : (
                      <SingleCheck className="text-gray-400 w-[13px] h-[13px]" />
                    ))}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
