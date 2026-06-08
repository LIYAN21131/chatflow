import type { Priority, ReminderType, TaskStatus } from "@/types/task";

export const priorityLabels: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const statusLabels: Record<TaskStatus, string> = {
  pending: "未完成",
  completed: "已完成",
};

export const reminderLabels: Record<ReminderType, string> = {
  "10min": "截止前10分钟",
  "1hour": "截止前1小时",
  "1day": "截止前1天",
  none: "不提醒",
};

export const taskFilterLabels = {
  all: "全部",
  pending: "未完成",
  completed: "已完成",
} as const;
