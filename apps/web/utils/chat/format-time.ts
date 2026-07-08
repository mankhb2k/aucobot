/** Định dạng thời gian ngắn cho danh sách hội thoại (kiểu Telegram/Zalo). */

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Hôm nay → "14:05"; trong tuần → "T3"; xa hơn → "02/07".
 */
export function formatConversationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (isSameDay(date, now)) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays < 7) {
    return WEEKDAYS[date.getDay()];
  }

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

/** Giờ:phút cho tin nhắn trong khung chat. */
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Ngày đầy đủ "24/06/2026" cho panel thông tin. */
export function formatFullDate(iso: string): string {
  const date = new Date(iso);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** Nhãn ngăn cách ngày trong khung chat: "Hôm nay" · "Hôm qua" · "24/06/2026". */
export function formatDateDivider(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (isSameDay(date, now)) return "Hôm nay";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Hôm qua";

  return formatFullDate(iso);
}

/** Khóa ngày (YYYY-M-D) để phát hiện đổi ngày giữa các tin nhắn. */
export function dayKey(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
