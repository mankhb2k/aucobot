"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

import styles from "./PanelInfoRow.module.css";

export interface PanelInfoRowProps {
  label: string;
  value: string;
  /** Hiện nút sao chép giá trị. */
  copyable?: boolean;
  /** Hiển thị giá trị dạng mã (ID). */
  mono?: boolean;
}

export function PanelInfoRow({
  label,
  value,
  copyable = false,
  mono = false,
}: PanelInfoRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard không khả dụng — bỏ qua */
    }
  };

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.valueWrap}>
        <span
          className={styles.value}
          data-mono={mono ? "true" : undefined}
          title={value}
        >
          {value}
        </span>
        {copyable ? (
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label={copied ? "Đã sao chép" : "Sao chép"}
            title={copied ? "Đã sao chép" : "Sao chép"}
          >
            {copied ? (
              <Check className={styles.copyIcon} data-copied="true" />
            ) : (
              <Clipboard className={styles.copyIcon} />
            )}
          </button>
        ) : null}
      </span>
    </div>
  );
}
