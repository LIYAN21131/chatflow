"use client";

import { Check, Trash2 } from "lucide-react";
import { Button, Card, PriorityPill } from "@/components/ui";
import { getTaskTimeLabel, getTaskTimeTone } from "@/lib/taskTime";
import type { Task } from "@/types/task";

type ResultTaskCardProps = {
  task: Task;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ResultTaskCard({ task, checked, onToggle, onEdit, onDelete }: ResultTaskCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-1 grid size-6 shrink-0 place-items-center rounded-lg border ${
            checked ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
          }`}
          aria-label="选择任务"
        >
          {checked && <Check size={16} />}
        </button>
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
        </div>
        <div className="shrink-0">
          <PriorityPill value={task.priority} />
        </div>
      </div>
      <div className="line-clamp-3 break-all rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
        来源：{task.sourceText}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={onEdit}
          className="flex h-10 items-center justify-center gap-2 rounded-xl text-sm"
        >
          编辑
        </Button>
        <Button
          variant="secondary"
          onClick={onDelete}
          className="flex h-10 items-center justify-center gap-2 rounded-xl text-sm text-rose-500"
        >
          <Trash2 size={16} />
          删除
        </Button>
      </div>
    </Card>
  );
}
