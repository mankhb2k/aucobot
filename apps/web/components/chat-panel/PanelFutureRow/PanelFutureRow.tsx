import styles from "./PanelFutureRow.module.css";
import type { ComponentType, SVGProps } from "react";


export interface PanelFutureRowProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** Kiểu phần đuôi: công tắc tắt (disabled) hoặc nhãn "Sắp có". */
  trailing?: "toggle" | "badge";
}

export function PanelFutureRow({
  icon: Icon,
  label,
  trailing = "badge",
}: PanelFutureRowProps) {
  return (
    <div className={styles.row} aria-disabled>
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}</span>
      {trailing === "toggle" ? (
        <span className={styles.toggle} aria-hidden>
          <span className={styles.knob} />
        </span>
      ) : (
        <span className={styles.badge}>Sắp có</span>
      )}
    </div>
  );
}
