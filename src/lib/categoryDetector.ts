import type { TaskCategory } from "@/types/task";

export function detectCategory(text: string): TaskCategory {
  if (/考试|重修|期末|补考/.test(text)) return "考试";
  if (/会议|开会|讨论|组会/.test(text)) return "会议";
  if (/领导|客户|项目|需求|汇报/.test(text)) return "工作";
  if (/作业|实验报告|课程|PPT|论文|调研/.test(text)) return "学习";
  if (/快递|购物|缴费|预约/.test(text)) return "生活";
  return "其他";
}
