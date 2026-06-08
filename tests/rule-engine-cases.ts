import type { TaskCategory, TimeType } from "@/types/task";

export type RuleEngineCase = {
  input: string;
  expectedTitle?: string;
  expectedTimeType?: TimeType;
  expectedDeadline?: string;
  expectedStartTime?: string;
  expectedEndTime?: string;
  expectedLocation?: string;
  expectedCategory?: TaskCategory;
};

export const RULE_ENGINE_CASES: RuleEngineCase[] = [
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
    input: "下周一开会前整理一下用户调研结果。",
    expectedTitle: "整理用户调研结果",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-15 18:00",
    expectedCategory: "会议",
  },
  {
    input: "考试时间：6月16日12:15-14:15。",
    expectedTitle: "参加考试",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-16 12:15",
    expectedEndTime: "2026-06-16 14:15",
    expectedCategory: "考试",
  },
  {
    input: "6月3号下午2:00-4:00大学物理b1考试，考试地点9A207。",
    expectedTitle: "参加大学物理b1考试",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-03 14:00",
    expectedEndTime: "2026-06-03 16:00",
    expectedLocation: "9A207",
    expectedCategory: "考试",
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
    input: "https://example.com/read.do?channelid=1799&infoid=359180",
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
    input: "活动时间：6月13日晚上8点-10点，地点：教学楼A207。",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-13 20:00",
    expectedEndTime: "2026-06-13 22:00",
    expectedLocation: "教学楼A207",
  },
  {
    input: "明天上午9点在9A207开会。",
    expectedTitle: "参加会议",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-09 09:00",
    expectedLocation: "9A207",
    expectedCategory: "会议",
  },
  {
    input: "张三负责PPT，明天前发给老师。",
    expectedTitle: "张三完成PPT",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-09 18:00",
  },
  {
    input: "今天提交作业；明天整理调研结果。",
    expectedTitle: "提交作业",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-08 18:00",
  },
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
    input: "2026-06-12前提交论文。",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-12 18:00",
  },
  {
    input: "2026年6月12日下午3点前提交实验报告。",
    expectedTitle: "提交实验报告",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-12 15:00",
  },
  {
    input: "2026年6月12号下午3点前提交实验报告。",
    expectedTitle: "提交实验报告",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-12 15:00",
  },
  {
    input: "上午9点15分提交PPT。",
    expectedTitle: "提交PPT",
    expectedTimeType: "deadline",
  },
  {
    input: "下午3点30分提交PPT。",
    expectedTitle: "提交PPT",
    expectedTimeType: "deadline",
  },
  {
    input: "晚上8点发给老师。",
    expectedTimeType: "deadline",
  },
  {
    input: "请查看课程学习通知。",
    expectedTitle: "查看相关通知",
    expectedTimeType: "unknown",
  },
  {
    input: "大家好，今天天气不错。",
  },
  {
    input:
      "各位同学：教务处发布《关于2025-2026-2 全校通识选修课程（在线课程）期末考试安排的通知》，链接：https://nic.example.com/read.do?channelid=1799&infoid=359180。",
    expectedTitle: "查看通识选修课期末考试安排",
    expectedTimeType: "unknown",
    expectedCategory: "考试",
  },
  {
    input: "报名截止：6月20日18:00，请及时提交申请。",
    expectedTimeType: "deadline",
    expectedDeadline: "2026-06-20 18:00",
  },
  {
    input: "答辩时间：6月18日下午2点到4点，地点A207。",
    expectedTimeType: "event",
    expectedStartTime: "2026-06-18 14:00",
    expectedEndTime: "2026-06-18 16:00",
    expectedLocation: "A207",
  },
];
