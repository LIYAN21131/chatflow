"use client";

import { CalendarClock, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, PriorityPill } from "@/components/ui";
import { statusLabels } from "@/lib/taskLabels";
import { getTaskTimeLabel, getTaskTimeTone } from "@/lib/taskTime";
import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  compact?: boolean;
  onClick?: () => void;
};

export function TaskCard({ task, compact = false, onClick }: TaskCardProps) {
  const statusTone =
    task.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600";
  const Icon = compact ? CalendarClock : CheckCircle2;

  const content = (
    <Card className="flex items-start gap-3">
      <div className={`mt-1 grid size-11 shrink-0 place-items-center rounded-full ${statusTone}`}>
        <Icon size={compact ? 19 : 21} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 break-words text-lg font-bold leading-snug text-slate-900">
          {task.summary || task.title}
        </p>
        <p
          className={`mt-2 inline-flex max-w-full rounded-full px-3 py-1 text-[13px] font-semibold ${getTaskTimeTone(
            task,
          )}`}
        >
          {getTaskTimeLabel(task)}
        </p>
        {task.location && (
          <p className="mt-2 text-xs font-semibold text-slate-500">地点：{task.location}</p>
        )}
        {task.confidence < 70 && (
          <p className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
            建议确认
          </p>
        )}
        {!compact && (
          <p className="mt-2 line-clamp-3 break-all text-xs leading-5 text-slate-400">
            来源：{task.sourceText}
          </p>
        )}
        {!compact && <p className="mt-1 text-xs text-slate-400">{statusLabels[task.status]}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1 pt-1">
        <PriorityPill value={task.priority} />
        {!compact && <ChevronRight size={18} className="text-slate-300" />}
      </div>
    </Card>
  );

  if (!onClick) return content;

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}
