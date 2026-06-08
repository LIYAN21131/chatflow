import type { TaskIntent, TimeType } from "@/types/task";

type ConfidenceInput = {
  text: string;
  title: string;
  intent: TaskIntent;
  timeType: TimeType;
  deadline?: string;
  startTime?: string;
  location?: string;
};

export function scoreConfidence(input: ConfidenceInput) {
  let score = 0;
  const hasExplicitAction = input.intent !== "unknown";
  const hasTime = input.timeType !== "unknown" && Boolean(input.deadline || input.startTime);
  const hasObject = /报告|PPT|调研|通知|安排|考试|会议|作业|论文|课程|项目|需求/.test(input.title);
  const hasOwner = /[\u4e00-\u9fa5]{2,4}负责/.test(input.text);

  if (hasExplicitAction) score += 30;
  if (hasTime) score += 25;
  if (hasObject) score += 20;
  if (input.location) score += 10;
  if (hasOwner) score += 10;
  if (
    /https?:\/\//i.test(input.text) &&
    input.text.replace(/https?:\/\/\S+/gi, "").trim().length < 8
  )
    score -= 30;
  if (/发布日期|发布时间/.test(input.text) && !hasTime) score -= 30;
  if (
    /\b\d{4}-\d{4}-\d+\b/.test(input.text) &&
    !hasTime &&
    !/通知|安排|课程|考试/.test(input.text)
  ) {
    score -= 30;
  }
  if (!input.title.trim()) score -= 20;

  return Math.max(0, Math.min(100, score));
}

export function shouldGenerateTask(confidence: number) {
  return confidence >= 40;
}
