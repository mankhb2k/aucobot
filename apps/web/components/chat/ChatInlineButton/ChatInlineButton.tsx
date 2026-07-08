import styles from "./ChatInlineButton.module.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";


export interface ChatInlineButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  loading?: boolean;
}

export function ChatInlineButton({
  children,
  loading = false,
  disabled = false,
  className,
  type = "button",
  ...rest
}: ChatInlineButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={[styles.button, className].filter(Boolean).join(" ")}
      disabled={isDisabled}
      aria-busy={loading}
      data-loading={loading ? "true" : undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
