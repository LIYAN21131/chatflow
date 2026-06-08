import type { Priority } from "@/types/task";

export function detectPriority(text: string): Priority {
  if (/紧急|必须|务必|马上|尽快|今天|截止|别忘了|明天前|周五之前|前提交|前完成|点前/.test(text)) {
    return "high";
  }

  if (/明天|本周|下周|开会前|发到群里|整理|考试|会议/.test(text)) {
    return "medium";
  }

  return "low";
}
