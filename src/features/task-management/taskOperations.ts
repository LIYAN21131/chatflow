import { getNowIso } from "@/lib/date";
import { trackEvent } from "@/services/analytics";
import type { Task, TaskDraft } from "@/types/task";

export function createTask(draft: TaskDraft): Task {
  const now = getNowIso();
  const task: Task = {
    id: `task-${Date.now()}`,
    title: draft.title,
    summary: draft.summary ?? draft.title,
    deadline: draft.deadline,
    startTime: draft.startTime,
    endTime: draft.endTime,
    location: draft.location,
    timeType: draft.timeType ?? (draft.deadline ? "deadline" : "unknown"),
    category: draft.category ?? "其他",
    priority: draft.priority,
    confidence: draft.confidence ?? 100,
    sourceText: draft.sourceText ?? "手动创建",
    status: "pending",
    reminder: draft.reminder,
    createdAt: now,
    updatedAt: now,
  };

  trackEvent("task_created", { taskId: task.id });
  return task;
}

export function updateTask(task: Task, draft: TaskDraft): Task {
  return {
    ...task,
    title: draft.title,
    summary: draft.summary ?? draft.title,
    deadline: draft.deadline,
    startTime: draft.startTime,
    endTime: draft.endTime,
    location: draft.location ?? task.location,
    timeType: draft.timeType ?? task.timeType,
    category: draft.category ?? task.category,
    priority: draft.priority,
    confidence: draft.confidence ?? task.confidence,
    reminder: draft.reminder,
    sourceText: draft.sourceText ?? task.sourceText,
    updatedAt: getNowIso(),
  };
}

export function completeTask(task: Task): Task {
  trackEvent("task_completed", { taskId: task.id });
  return {
    ...task,
    status: "completed",
    updatedAt: getNowIso(),
  };
}

export function deleteTask(tasks: Task[], taskId: string): Task[] {
  trackEvent("task_deleted", { taskId });
  return tasks.filter((task) => task.id !== taskId);
}

export function mergeConfirmedTasks(currentTasks: Task[], confirmedTasks: Task[]): Task[] {
  const currentIds = new Set(currentTasks.map((task) => task.id));
  const newTasks = confirmedTasks.filter((task) => !currentIds.has(task.id));
  trackEvent("task_confirmed", { taskCount: newTasks.length });
  return [...newTasks, ...currentTasks];
}
