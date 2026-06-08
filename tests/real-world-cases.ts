import type { RuleEngineCase } from "./rule-engine-cases";

export const REAL_WORLD_CASES: RuleEngineCase[] = [
  {
    input:
      "各位同学通知参加理学院大学物理组班重修考试，时间地点如下：\n第十四周周三（6月3号）下午，下午2:00-4:00大学物理b1和c1，考试地点9A207。\n下午4:00-6:00，大学物理b2和c2，考试地点9A207。",
    expectedTitle: "参加大学物理b1和c1重修考试",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-03 14:00",
    expectedEndTime: "2026-06-03 16:00",
    expectedLocation: "9A207",
    expectedCategory: "考试",
  },
  {
    input:
      "各位同学：教务处发布《关于2025-2026-2 全校通识选修课程（在线课程）期末考试安排的通知》，链接：https://nic.example.com/read.do?channelid=1799&infoid=359180。考试时间：6月16日12:15-14:15。",
    expectedTitle: "查看通识选修课期末考试安排",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-16 12:15",
    expectedEndTime: "2026-06-16 14:15",
    expectedCategory: "考试",
  },
  {
    input: "明天上午9点在9A207开会，讨论项目需求和汇报材料。",
    expectedTitle: "参加会议",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-09 09:00",
    expectedLocation: "9A207",
    expectedCategory: "会议",
  },
  {
    input: "项目分工：张三负责PPT，李四整理用户调研结果，明天前发给老师。",
    expectedTitle: "张三完成PPT",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-09 18:00",
  },
  {
    input: "群公告：报名截止：6月20日18:00，请及时提交申请。",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-20 18:00",
  },
];
