import type { RuleEngineCase } from "./rule-engine-cases";

export const EVENT_CASES: RuleEngineCase[] = [
  {
    input: "考试时间：6月16日12:15-14:15。",
    expectedTitle: "参加考试",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-16 12:15",
    expectedEndTime: "2026-06-16 14:15",
    expectedCategory: "考试",
  },
  {
    input: "会议时间：2026-06-12 15:00-16:00，会议室301。",
    expectedTitle: "参加会议",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-12 15:00",
    expectedEndTime: "2026-06-12 16:00",
    expectedLocation: "301",
    expectedCategory: "会议",
  },
  {
    input: "上课时间：6月12日上午9点-11点，地点教学楼A207。",
    expectedTitle: "参加课程",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-12 09:00",
    expectedEndTime: "2026-06-12 11:00",
    expectedLocation: "教学楼A207",
  },
  {
    input: "答辩时间：6月18日下午2点到4点，地点A207。",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-18 14:00",
    expectedEndTime: "2026-06-18 16:00",
    expectedLocation: "A207",
  },
];
