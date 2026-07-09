"use client";

import {
  Image as ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { FloatingBar } from "@/components/ui/FloatingBar/FloatingBar";

import styles from "./Composer.module.css";

export interface ComposerProps {
  onSend?: (text: string) => void;
  onAttach?: () => void;
  onImage?: () => void;
  onEmoji?: () => void;
  onVoice?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const MAX_ROWS_PX = 400;
const iconProps = { className: styles.sideIcon, strokeWidth: 2 as const };

export function Composer({
  onSend,
  onAttach,
  onImage,
  onEmoji,
  onVoice,
  placeholder = "Nhắn tin",
  disabled = false,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return undefined;

    function adjustHeight() {
      if (!el) return;
      el.style.height = "auto";
      const targetHeight = Math.min(el.scrollHeight, MAX_ROWS_PX);
      el.style.height = `${targetHeight}px`;

      if (el.scrollHeight <= MAX_ROWS_PX) {
        el.style.overflowY = "hidden";
      } else {
        el.style.overflowY = "auto";
      }
    }

    adjustHeight();

    const resizeObserver = new ResizeObserver(() => {
      adjustHeight();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [value]);

  const hasText = value.trim().length > 0;
  const canSend = hasText && !disabled;

  function send() {
    if (!canSend) return;
    onSend?.(value.trim());
    setValue("");
  }

  function handleAction() {
    if (hasText) send();
    else onVoice?.();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) send();
    }
  }

  return (
    <div className={styles.composer}>
      <FloatingBar align="end">
        <button
          type="button"
          className={styles.sideBtn}
          onClick={onAttach}
          disabled={disabled}
          aria-label="Đính kèm"
          title="Đính kèm"
        >
          <Paperclip {...iconProps} />
        </button>

        <button
          type="button"
          className={styles.sideBtn}
          onClick={onImage}
          disabled={disabled}
          aria-label="Gửi ảnh"
          title="Gửi ảnh"
        >
          <ImageIcon {...iconProps} aria-hidden />
        </button>

        <textarea
          ref={textareaRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
        />

        <button
          type="button"
          className={styles.sideBtn}
          onClick={onEmoji}
          disabled={disabled}
          aria-label="Emoji"
          title="Emoji"
        >
          <Smile {...iconProps} />
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleAction}
          disabled={disabled}
          aria-label={hasText ? "Gửi" : "Ghi âm"}
          title={hasText ? "Gửi" : "Ghi âm"}
          data-mode={hasText ? "send" : "voice"}
        >
          <span className={styles.actionIcons} aria-hidden>
            <Mic
              className={`${styles.actionIcon} ${styles.micIcon}`}
              strokeWidth={2}
            />
            <Send
              className={`${styles.actionIcon} ${styles.planeIcon}`}
              strokeWidth={2}
            />
          </span>
        </button>
      </FloatingBar>
    </div>
  );
}
