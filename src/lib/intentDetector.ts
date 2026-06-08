import type { TaskIntent } from "@/types/task";

export function detectIntent(text: string): TaskIntent {
  if (/负责|分工|由.+做/.test(text)) return "assign";
  if (/通知|链接|查看|发布|安排/.test(text)) return "view_notice";
  if (/提交|上交|交一下|交给|截止|报名/.test(text)) return "submit";
  if (/整理|汇总/.test(text)) return "organize";
  if (/发送|发给|发到|转发/.test(text)) return "send";
  if (/考试|会议|开会|面试|讲座|上课|活动|集合|培训|答辩|时间地点|考试时间|会议时间/.test(text)) {
    return "event";
  }
  return "unknown";
}

export function hasTaskIntent(text: string) {
  return detectIntent(text) !== "unknown";
}
