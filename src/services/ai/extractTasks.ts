import { detectCategory } from "@/lib/categoryDetector";
import { scoreConfidence, shouldGenerateTask } from "@/lib/confidenceScorer";
import {
  detectTimeType,
  extractContextDate,
  extractExplicitDate,
  extractTimeRanges,
  parseTimeInfo,
} from "@/lib/dateParser";
import { detectIntent } from "@/lib/intentDetector";
import { parseLocation } from "@/lib/locationParser";
import { detectPriority } from "@/lib/priorityDetector";
import { segmentText } from "@/lib/segmenter";
import { normalizeTask } from "@/lib/taskNormalizer";
import { cleanText } from "@/lib/textCleaner";
import { generateTitleAndSummary } from "@/lib/titleGenerator";
import { trackEvent } from "@/services/analytics";
import type { Task, TaskExtractionResult, TimeType } from "@/types/task";

function createTaskId(index: number) {
  return `task-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

function resolveTime(segmentText: string, contextText: string, contextDate?: Date) {
  const explicitDate = extractExplicitDate(segmentText, new Date(), { rollPast: false });
  const inheritedDate = explicitDate.date ?? extractContextDate(contextText) ?? contextDate;
  const ranges = extractTimeRanges(segmentText, inheritedDate ?? new Date());

  if (ranges[0]) {
    const detectedType = detectTimeType(contextText);
    return {
      deadline: detectedType === "deadline" ? ranges[0].startTime : "",
      startTime: detectedType === "event" ? ranges[0].startTime : undefined,
      endTime: detectedType === "event" ? ranges[0].endTime : undefined,
      timeType: detectedType === "unknown" ? ("event" as TimeType) : detectedType,
      contextDate: inheritedDate,
    };
  }

  const parsed = parseTimeInfo(segmentText);
  if (parsed.timeType !== "unknown") {
    return {
      deadline: parsed.deadline,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
      timeType: parsed.timeType,
      contextDate: inheritedDate,
    };
  }

  return {
    deadline: "",
    timeType: "unknown" as TimeType,
    contextDate: inheritedDate,
  };
}

export function extractTasksFromText(inputText: string): Task[] {
  const cleaned = cleanText(inputText);
  const segments = segmentText(cleaned.originalText, cleaned.textForParsing, 10);
  const tasks: Task[] = [];
  let contextDate: Date | undefined;

  for (const segment of segments) {
    const time = resolveTime(segment.parsingText, segment.contextText, contextDate);
    contextDate = time.contextDate ?? contextDate;

    const location = parseLocation(segment.parsingText) ?? parseLocation(segment.contextText);
    const detectedIntent = detectIntent(segment.contextText);
    const segmentIntent = detectIntent(segment.parsingText);
    const intent =
      time.timeType === "event"
        ? segmentIntent === "unknown"
          ? "event"
          : segmentIntent
        : detectedIntent;
    const { title, summary } = generateTitleAndSummary(
      segment.parsingText,
      segment.contextText,
      intent,
    );
    const priority = detectPriority(segment.contextText);
    const category = detectCategory(`${segment.contextText} ${title}`);
    const confidence = scoreConfidence({
      text: segment.contextText,
      title,
      intent,
      timeType: time.timeType,
      deadline: time.deadline,
      startTime: time.startTime,
      location,
    });

    if (!shouldGenerateTask(confidence)) continue;

    tasks.push(
      normalizeTask({
        id: createTaskId(tasks.length),
        title,
        summary,
        sourceText: segment.sourceText,
        deadline: time.deadline,
        startTime: time.startTime,
        endTime: time.endTime,
        timeType: time.timeType,
        location,
        category,
        priority,
        confidence,
      }),
    );
  }

  return tasks;
}

export async function extractTasks(chatText: string): Promise<TaskExtractionResult> {
  trackEvent("analysis_started", { textLength: chatText.length });

  const tasks = extractTasksFromText(chatText);
  const result: TaskExtractionResult = {
    success: tasks.length > 0,
    tasks,
  };

  trackEvent("analysis_completed", {
    success: result.success,
    taskCount: result.tasks.length,
  });

  return result;
}
