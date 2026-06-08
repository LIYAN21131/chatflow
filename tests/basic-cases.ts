import type { RuleEngineCase } from "./rule-engine-cases";

export const BASIC_CASES: RuleEngineCase[] = [
  {
    input: "周五之前把实验报告交一下，记得附上数据截图。",
    expectedTitle: "提交实验报告",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-12 18:00",
    expectedCategory: "学习",
  },
  {
    input: "明天下午3点前把小组汇报PPT发到群里。",
    expectedTitle: "提交小组汇报PPT",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-09 15:00",
    expectedCategory: "工作",
  },
  {
    input: "整理用户调研结果。",
    expectedTitle: "整理用户调研结果",
    expectedTimeType: "unknown",
    expectedCategory: "学习",
  },
  {
    input: "张三负责PPT，明天前发给老师。",
    expectedTitle: "张三完成PPT",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-09 18:00",
  },
];
