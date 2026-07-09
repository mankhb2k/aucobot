import styles from "./SidebarMain.module.css";
import type { ReactNode } from "react";


interface SidebarMainProps {
  header: ReactNode;
  content: ReactNode;
}

export function SidebarMain({ header, content }: SidebarMainProps) {
  return (
    <div className={styles.sidebarMain}>
      <div className={styles.header}>{header}</div>
      <div className={styles.content}>{content}</div>
    </div>
  );
}
