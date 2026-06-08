import { STORAGE_KEYS } from "@/constants/config";
import { MOCK_TASKS } from "@/mock/tasks";
import { readStorage, writeStorage } from "@/lib/storage";
import type {
  Priority,
  ReminderType,
  Task,
  TaskCategory,
  TaskStatus,
  TimeType,
} from "@/types/task";

type LegacyTask = Partial<Task> & {
  source?: string;
  note?: string;
};

const priorityMap: Record<string, Priority> = {
  高: "high",
  中: "medium",
  低: "low",
  high: "high",
  medium: "medium",
  low: "low",
};

const statusMap: Record<string, TaskStatus> = {
  未完成: "pending",
  已完成: "completed",
  pending: "pending",
  completed: "completed",
};

const reminderMap: Record<string, ReminderType> = {
  截止前10分钟: "10min",
  截止前1小时: "1hour",
  截止前1天: "1day",
  不提醒: "none",
  "10min": "10min",
  "1hour": "1hour",
  "1day": "1day",
  none: "none",
};

const timeTypeMap: Record<string, TimeType> = {
  deadline: "deadline",
  event: "event",
  unknown: "unknown",
};

const categoryMap: Record<string, TaskCategory> = {
  学习: "学习",
  工作: "工作",
  会议: "会议",
  考试: "考试",
  生活: "生活",
  其他: "其他",
};

function normalizeTask(task: LegacyTask, index: number): Task {
  const now = new Date().toISOString();
  const title = task.title ?? "待办事项";

  return {
    id: task.id ?? `task-initial-${index}`,
    title,
    summary: task.summary ?? title,
    sourceText: task.sourceText ?? task.source ?? task.note ?? "手动创建",
    deadline: task.deadline ?? "",
    startTime: task.startTime,
    endTime: task.endTime,
    location: task.location,
    timeType: timeTypeMap[String(task.timeType)] ?? (task.deadline ? "deadline" : "unknown"),
    category: categoryMap[String(task.category)] ?? "其他",
    priority: priorityMap[String(task.priority)] ?? "medium",
    confidence: typeof task.confidence === "number" ? task.confidence : 100,
    status: statusMap[String(task.status)] ?? "pending",
    reminder: reminderMap[String(task.reminder)] ?? "1hour",
    createdAt: task.createdAt ?? now,
    updatedAt: task.updatedAt ?? now,
  };
}

export const taskRepository = {
  getAll(): Task[] {
    const storedTasks = readStorage<LegacyTask[] | null>(STORAGE_KEYS.tasks, null);
    const tasks = storedTasks?.length ? storedTasks : MOCK_TASKS;
    return tasks.map(normalizeTask);
  },

  saveAll(tasks: Task[]) {
    writeStorage(STORAGE_KEYS.tasks, tasks);
  },

  getById(id: string): Task | undefined {
    return this.getAll().find((task) => task.id === id);
  },
};
