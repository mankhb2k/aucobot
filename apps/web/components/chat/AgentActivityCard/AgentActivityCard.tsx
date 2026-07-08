import {
  ArrowRightCircle,
  Clock,
  FileText,
  Pencil,
  Search,
  Settings,
  Sparkles,
  Send,
  Zap,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar/Avatar";

import bubbleStyles from "../MessageBubble/MessageBubble.module.css";

import styles from "./AgentActivityCard.module.css";
import type { AgentActionKind, AgentActivity } from "@/types/chat";
import type { LucideIcon } from "lucide-react";

export interface AgentActivityCardProps {
  activities: AgentActivity[];
  /** Tên agent — hiện avatar cạnh timeline. */
  agentName?: string;
}

const KIND_ICON: Record<AgentActionKind, LucideIcon> = {
  thinking: Sparkles,
  web_search: Search,
  read_document: FileText,
  write_content: Pencil,
  build_workflow: Settings,
  schedule: Clock,
  publish: Send,
  handoff: ArrowRightCircle,
  generic: Zap,
};

function headerState(activities: AgentActivity[]): {
  label: string;
  state: "working" | "error" | "done";
} {
  if (activities.some((a) => a.status === "running"))
    return { label: "Đang làm việc", state: "working" };
  if (activities.some((a) => a.status === "error"))
    return { label: "Gặp lỗi", state: "error" };
  return { label: "Đã hoàn thành", state: "done" };
}

export function AgentActivityCard({
  activities,
  agentName = "Trợ Lý",
}: AgentActivityCardProps) {
  if (activities.length === 0) return null;

  const { label, state } = headerState(activities);
  const doneCount = activities.filter((a) => a.status === "done").length;

  return (
    <div className={styles.row}>
      <div className={`${bubbleStyles.avatarSlot} ${styles.avatarSlot}`}>
        <Avatar name={agentName} seed={agentName} size="sm" />
      </div>

      <div className={styles.card}>
        <div className={styles.header} data-state={state}>
          <span className={styles.headerDot} aria-hidden />
          <span className={styles.headerText}>{label}</span>
          <span className={styles.headerCount}>
            {doneCount}/{activities.length}
          </span>
        </div>

        <ol className={styles.timeline}>
          {activities.map((activity, i) => {
            const Icon = KIND_ICON[activity.kind ?? "generic"];
            const isLast = i === activities.length - 1;
            const next = activities[i + 1];
            const connectorFilled =
              activity.status === "done" &&
              (state === "done" ||
                next?.status === "done" ||
                next?.status === "error");
            const connectorFlowing =
              activity.status === "done" && next?.status === "running";

            return (
              <li
                key={activity.id}
                className={styles.step}
                data-status={activity.status}
              >
                <span className={styles.marker}>
                  <span className={styles.iconBubble}>
                    <Icon className={styles.icon} />
                  </span>
                  {!isLast ? (
                    <span
                      className={styles.connector}
                      data-filled={connectorFilled ? "true" : undefined}
                      data-flowing={connectorFlowing ? "true" : undefined}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span className={styles.body}>
                  <span className={styles.label}>{activity.label}</span>
                  {activity.detail ? (
                    <span className={styles.detail}>{activity.detail}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
