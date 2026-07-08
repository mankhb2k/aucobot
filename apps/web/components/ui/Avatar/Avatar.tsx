import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  /** Tên hiển thị — dùng để lấy chữ cái đầu. */
  name: string;
  /** Khóa sinh màu ổn định (mặc định = name). Thường truyền conversation id. */
  seed?: string;
  size?: AvatarSize;
}

/** Bảng màu nền avatar — hài hòa với theme cyan, đủ tương phản với chữ trắng. */
const PALETTE = [
  "#32b8e8",
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
] as const;

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ name, seed, size = "md" }: AvatarProps) {
  const background = pickColor(seed ?? name);

  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
