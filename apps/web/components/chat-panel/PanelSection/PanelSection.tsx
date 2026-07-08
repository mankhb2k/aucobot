import styles from "./PanelSection.module.css";
import type { ReactNode } from "react";


export interface PanelSectionProps {
  title?: string;
  children: ReactNode;
}

export function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <section className={styles.section}>
      {title ? <h4 className={styles.title}>{title}</h4> : null}
      {children}
    </section>
  );
}
