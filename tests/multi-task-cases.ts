import type { RuleEngineCase } from "./rule-engine-cases";

export const MULTI_TASK_CASES: RuleEngineCase[] = [
  {
    input: "今天提交作业；明天整理调研结果。",
    expectedTitle: "提交作业",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-08 18:00",
  },
  {
    input:
      "第十四周周三（6月3号）下午，下午2:00-4:00大学物理b1考试，考试地点9A207。\n下午4:00-6:00大学物理b2考试，考试地点9A207。",
    expectedTitle: "参加大学物理b1考试",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-03 14:00",
    expectedEndTime: "2026-06-03 16:00",
    expectedLocation: "9A207",
    expectedCategory: "考试",
  },
];
