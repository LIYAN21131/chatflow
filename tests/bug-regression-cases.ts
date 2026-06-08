import type { TaskCategory, TimeType } from "@/types/task";

export interface BugRegressionCase {
  id: string;
  title: string;
  description: string;
  input: string;
  expected: {
    title?: string;
    summary?: string;
    timeType?: TimeType;
    deadline?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    category?: TaskCategory;
  };
}

export const BUG_REGRESSION_CASES: BugRegressionCase[] = [
  {
    id: "Bug-001",
    title: "考试时间标题残片",
    description: "考试时间曾被错误解析成标题“考试时间：:15”。",
    input: "考试时间：6月16日12:15-14:15。",
    expected: {
      title: "参加考试",
      timeType: "event",
      startTime: "2026-06-16 12:15",
      endTime: "2026-06-16 14:15",
    },
  },
  {
    id: "Bug-002",
    title: "考试时间显示为待确认",
    description: "包含明确考试时间范围时，曾错误显示“时间待确认”。",
    input: "考试时间：6月16日12:15-14:15。",
    expected: {
      timeType: "event",
      startTime: "2026-06-16 12:15",
      endTime: "2026-06-16 14:15",
    },
  },
  {
    id: "Bug-003",
    title: "通知发布日期误识别为截止时间",
    description: "通知标题中的学年学期编号或发布语义曾被误转成 2026-06-08 18:00。",
    input: "教务处发布《关于2025-2026-2全校通识选修课程期末考试安排的通知》",
    expected: {
      title: "查看通识选修课期末考试安排",
      timeType: "unknown",
      deadline: "",
      category: "考试",
    },
  },
  {
    id: "Bug-004",
    title: "URL 数字误识别为时间",
    description: "URL 参数 infoid/channelid 中的数字曾干扰时间识别。",
    input: "https://xxx.com?infoid=359180",
    expected: {
      timeType: "unknown",
      deadline: "",
    },
  },
  {
    id: "Bug-005",
    title: "学年编号误识别为时间",
    description: "纯学年编号 2025-2026-2 曾被当成日期。",
    input: "2025-2026-2",
    expected: {
      timeType: "unknown",
      deadline: "",
    },
  },
  {
    id: "Bug-006",
    title: "长通知标题直接截取原文",
    description: "长通知曾直接作为卡片标题，导致展示冗长且重点不清。",
    input: "各位同学：教务处发布《关于2025-2026-2全校通识选修课程（在线课程）期末考试安排的通知》",
    expected: {
      title: "查看通识选修课期末考试安排",
      summary: "查看通识选修课期末考试安排",
      timeType: "unknown",
      category: "考试",
    },
  },
  {
    id: "Bug-007",
    title: "上下文日期丢失",
    description: "时间段在下一行时，曾无法继承上一行括号中的 6月3号。",
    input: "第十四周周三（6月3号）下午\n\n下午2:00-4:00大学物理b1考试",
    expected: {
      title: "参加大学物理b1考试",
      timeType: "event",
      startTime: "2026-06-03 14:00",
      endTime: "2026-06-03 16:00",
      category: "考试",
    },
  },
  {
    id: "Bug-008",
    title: "下午时间解析成凌晨",
    description: "下午4:00-6:00 曾被解析成 04:00-06:00。",
    input: "第十四周周三（6月3号）下午\n下午4:00-6:00大学物理b2考试",
    expected: {
      title: "参加大学物理b2考试",
      timeType: "event",
      startTime: "2026-06-03 16:00",
      endTime: "2026-06-03 18:00",
      category: "考试",
    },
  },
];
