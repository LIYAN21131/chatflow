import type { Priority, ReminderType, Task, TaskCategory, TimeType } from "@/types/task";
import { cleanGeneratedTitle } from "@/lib/titleGenerator";

type NormalizerInput = {
  id: string;
  title: string;
  summary: string;
  sourceText: string;
  deadline?: string;
  startTime?: string;
  endTime?: string;
  timeType: TimeType;
  location?: string;
  category: TaskCategory;
  priority: Priority;
  confidence: number;
  reminder?: ReminderType;
};

function normalizeDateTime(value?: string) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}`;
  return value;
}

export function normalizeTask(input: NormalizerInput): Task {
  const now = new Date().toISOString();
  const title = cleanGeneratedTitle(input.title) || "查看相关通知";
  const summary = cleanGeneratedTitle(input.summary) || title;

  return {
    id: input.id,
    title,
    summary: summary.length > 28 ? `${summary.slice(0, 27)}…` : summary,
    sourceText: input.sourceText,
    deadline: normalizeDateTime(input.deadline),
    startTime: normalizeDateTime(input.startTime) || undefined,
    endTime: normalizeDateTime(input.endTime) || undefined,
    timeType: input.timeType,
    location: input.location,
    category: input.category,
    priority: input.priority,
    confidence: input.confidence,
    status: "pending",
    reminder: input.reminder ?? "1hour",
    createdAt: now,
    updatedAt: now,
  };
}
