"use client";

import { useState } from "react";
import { priorityLabels, reminderLabels } from "@/lib/taskLabels";
import type { Priority, ReminderType, Task, TaskDraft } from "@/types/task";
import { Button, Card } from "@/components/ui";

type TaskEditorProps = {
  task?: Task;
  onCancel: () => void;
  onSave: (draft: TaskDraft) => void;
};

const defaultDraft: TaskDraft = {
  title: "",
  deadline: "2026-06-12 18:00",
  priority: "medium",
  reminder: "1hour",
  sourceText: "手动创建",
};

const priorities: Priority[] = ["high", "medium", "low"];
const reminders: ReminderType[] = ["10min", "1hour", "1day", "none"];

export function TaskEditor({ task, onCancel, onSave }: TaskEditorProps) {
  const [draft, setDraft] = useState<TaskDraft>(
    task
      ? {
          title: task.title,
          deadline: task.deadline ?? "",
          priority: task.priority,
          reminder: task.reminder,
          sourceText: task.sourceText,
          startTime: task.startTime,
          endTime: task.endTime,
          location: task.location,
          timeType: task.timeType,
          category: task.category,
          confidence: task.confidence,
        }
      : defaultDraft,
  );

  return (
    <>
      <Card className="space-y-4">
        <Field label="任务标题">
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] outline-none focus:border-blue-400"
            placeholder="请输入任务标题"
          />
        </Field>
        <Field label="截止日期">
          <input
            value={draft.deadline ?? ""}
            onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] outline-none focus:border-blue-400"
          />
        </Field>
        <Field label="优先级">
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((priority) => (
              <button
                key={priority}
                onClick={() => setDraft({ ...draft, priority })}
                className={`h-11 rounded-2xl text-sm font-semibold ${
                  draft.priority === priority
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {priorityLabels[priority]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="提醒">
          <div className="grid grid-cols-2 gap-2">
            {reminders.map((reminder) => (
              <button
                key={reminder}
                onClick={() => setDraft({ ...draft, reminder })}
                className={`h-11 rounded-2xl text-sm font-semibold ${
                  draft.reminder === reminder
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {reminderLabels[reminder]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="来源聊天内容">
          <textarea
            value={draft.sourceText}
            onChange={(event) => setDraft({ ...draft, sourceText: event.target.value })}
            className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[15px] leading-6 outline-none focus:border-blue-400"
            placeholder="补充任务来源"
          />
        </Field>
      </Card>

      <div className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-2 gap-3 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <Button variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={() => onSave(draft)} disabled={!draft.title.trim()}>
          保存修改
        </Button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
