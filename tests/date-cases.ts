import type { RuleEngineCase } from "./rule-engine-cases";

export const DATE_CASES: RuleEngineCase[] = [
  {
    input: "今天下午5点前提交作业。",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-08 17:00",
  },
  {
    input: "明天上午9点提交PPT。",
    expectedTitle: "提交PPT",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-09 09:00",
  },
  {
    input: "下周一整理用户调研结果。",
    expectedTitle: "整理用户调研结果",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-15 18:00",
  },
  {
    input: "2026年6月12号下午3点前提交实验报告。",
    expectedTitle: "提交实验报告",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-12 15:00",
  },
  {
    input: "晚上8点发给老师。",
    expectedTimeType: "deadline",
  },
];
