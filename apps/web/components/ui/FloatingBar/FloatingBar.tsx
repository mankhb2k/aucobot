import styles from "./FloatingBar.module.css";

import type { ElementType, ReactNode } from "react";

export type FloatingBarAlign = "center" | "end";

interface FloatingBarProps {
  children: ReactNode;
  className?: string;
  as?: "header" | "div";
  align?: FloatingBarAlign;
}

export function FloatingBar({
  children,
  className,
  as: Tag = "div",
  align = "center",
}: FloatingBarProps) {
  const Component = Tag as ElementType;

  return (
    <Component
      className={[
        styles.bar,
        align === "end" ? styles.alignEnd : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
