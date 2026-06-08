import { applyReminder } from "@/services/reminder/reminderService";
import type { ReminderType, Task } from "@/types/task";

export function setTaskReminder(task: Task, reminder: ReminderType): Task {
  return applyReminder(task, reminder);
}
