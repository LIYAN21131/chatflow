import type { ReminderType, Task } from "@/types/task";

export function applyReminder(task: Task, reminder: ReminderType): Task {
  return {
    ...task,
    reminder,
    updatedAt: new Date().toISOString(),
  };
}
