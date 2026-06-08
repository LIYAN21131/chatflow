import { parseDeadlineDate } from "@/lib/dateParser";
import type { Task } from "@/types/task";

function getTimeOnly(dateTime: string) {
  return dateTime.split(" ")[1] ?? dateTime;
}

function getEventTimePrefix(task: Task) {
  if (/考试|期末考试|重修考试/.test(task.sourceText) || /考试/.test(task.title)) {
    return "考试时间";
  }

  if (/会议|开会/.test(task.sourceText) || /会议/.test(task.title)) return "会议时间";
  if (/上课/.test(task.sourceText)) return "上课时间";
  if (/讲座/.test(task.sourceText)) return "讲座时间";
  if (/面试/.test(task.sourceText)) return "面试时间";
  if (/集合/.test(task.sourceText)) return "集合时间";

  return "事件时间";
}

export function getTaskPrimaryTime(task: Task) {
  if (task.timeType === "unknown") return "";
  return task.timeType === "event"
    ? (task.startTime ?? task.deadline ?? "")
    : (task.deadline ?? "");
}

export function getTaskTimeDate(task: Task) {
  const primaryTime = getTaskPrimaryTime(task);
  return primaryTime ? parseDeadlineDate(primaryTime) : undefined;
}

export function getTaskTimeLabel(task: Task) {
  if (task.timeType === "event") {
    const startTime = task.startTime ?? task.deadline;
    if (!startTime) return "时间待确认";
    const range = task.endTime ? `${startTime} - ${getTimeOnly(task.endTime)}` : startTime;
    return `${getEventTimePrefix(task)} ${range}`;
  }

  if (task.timeType === "unknown" || !task.deadline) {
    return "时间待确认";
  }

  return `截止时间 ${task.deadline}`;
}

export function getTaskTimeTone(task: Task) {
  return task.timeType === "unknown" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600";
}
