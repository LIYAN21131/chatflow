export type Priority = "high" | "medium" | "low";

export type TaskStatus = "pending" | "completed";

export type ReminderType = "10min" | "1hour" | "1day" | "none";

export type TimeType = "deadline" | "event" | "unknown";

export type TaskCategory = "学习" | "工作" | "会议" | "考试" | "生活" | "其他";

export type TaskIntent =
  | "submit"
  | "event"
  | "view_notice"
  | "organize"
  | "send"
  | "assign"
  | "unknown";

export type Task = {
  id: string;
  title: string;
  summary: string;
  sourceText: string;
  deadline?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  timeType: TimeType;
  category: TaskCategory;
  priority: Priority;
  confidence: number;
  status: TaskStatus;
  reminder: ReminderType;
  createdAt: string;
  updatedAt: string;
};

export type TaskDraft = {
  title: string;
  summary?: string;
  deadline?: string;
  priority: Priority;
  reminder: ReminderType;
  sourceText?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  timeType?: TimeType;
  category?: TaskCategory;
  confidence?: number;
};

export type TaskExtractionResult = {
  success: boolean;
  tasks: Task[];
};

export type TaskFilter = "all" | TaskStatus;
