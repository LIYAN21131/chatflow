import type { Task } from "@/types/task";

const baseTimestamp = "2026-06-08T00:00:00.000Z";

export const SAMPLE_CHAT_TEXT = [
  "周五之前把实验报告交一下，记得附上数据截图。",
  "明天下午3点前把小组汇报PPT发到群里。",
  "下周一开会前整理一下用户调研结果。",
].join("\n");

export const MOCK_TASKS: Task[] = [
  {
    id: "task-report",
    title: "提交实验报告",
    summary: "提交实验报告",
    sourceText: "周五之前把实验报告交一下，记得附上数据截图。",
    deadline: "2026-06-12 18:00",
    timeType: "deadline",
    category: "学习",
    priority: "high",
    confidence: 100,
    status: "pending",
    reminder: "1hour",
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  },
  {
    id: "task-ppt",
    title: "提交小组汇报PPT",
    summary: "提交小组汇报PPT",
    sourceText: "明天下午3点前把小组汇报PPT发到群里。",
    deadline: "2026-06-09 15:00",
    timeType: "deadline",
    category: "学习",
    priority: "medium",
    confidence: 100,
    status: "pending",
    reminder: "10min",
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  },
  {
    id: "task-research",
    title: "整理用户调研结果",
    summary: "整理用户调研结果",
    sourceText: "下周一开会前整理一下用户调研结果。",
    deadline: "2026-06-15 18:00",
    timeType: "deadline",
    category: "学习",
    priority: "medium",
    confidence: 100,
    status: "completed",
    reminder: "none",
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  },
];
