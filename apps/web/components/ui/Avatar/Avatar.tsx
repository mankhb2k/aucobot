import * as AvatarPrimitive from "@radix-ui/react-avatar";

import styles from "./Avatar.module.css";

import type { AvatarSize } from "@/utils/avatar/types";

export type { AvatarSize } from "@/utils/avatar/types";

interface AvatarProps {
  /** Chữ hiển thị khi không có ảnh. */
  fallbackText: string;
  backgroundColor: string;
  size?: AvatarSize;
  src?: string;
  alt?: string;
  decorative?: boolean;
  imageFallbackDelayMs?: number;
}

export function Avatar({
  fallbackText,
  backgroundColor,
  size = "md",
  src,
  alt = "",
  decorative = true,
  imageFallbackDelayMs = 0,
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={`${styles.avatar} ${styles[size]}`}
      aria-hidden={decorative || undefined}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={decorative ? "" : alt}
          className={styles.image}
        />
      ) : null}
      <AvatarPrimitive.Fallback
        className={styles.fallback}
        style={{ background: backgroundColor }}
        delayMs={src ? imageFallbackDelayMs : 0}
      >
        {fallbackText}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
