import type { RuleEngineCase } from "./rule-engine-cases";

export const NOTICE_CASES: RuleEngineCase[] = [
  {
    input: "请查看《关于通识选修课期末考试安排的通知》。",
    expectedTitle: "查看通识选修课期末考试安排",
    expectedTimeType: "unknown",
    expectedCategory: "考试",
  },
  {
    input:
      "各位同学：通知链接：https://nic.example.com/read.do?channelid=1799&infoid=359180，请查看。",
    expectedTitle: "查看相关通知",
    expectedTimeType: "unknown",
  },
  {
    input: "教务处发布《关于2025-2026-2 全校通识选修课程期末考试安排的通知》。",
    expectedTitle: "查看通识选修课期末考试安排",
    expectedTimeType: "unknown",
    expectedCategory: "考试",
  },
  {
    input:
      "各位同学：教务处发布《关于2025-2026-2 全校通识选修课程（在线课程）期末考试安排的通知》，链接：https://nic.example.com/read.do?channelid=1799&infoid=359180。",
    expectedTitle: "查看通识选修课期末考试安排",
    expectedTimeType: "unknown",
    expectedCategory: "考试",
  },
];
