import type { TimeType } from "@/types/task";
import { stripParsingNoise } from "@/lib/textCleaner";

export type DeadlineParseMeta = {
  deadline: string;
  startTime?: string;
  endTime?: string;
  timeType: TimeType;
  hasExplicitDate: boolean;
  hasExplicitYear: boolean;
  hasExplicitTime: boolean;
  hasCompleteDateTime: boolean;
};

export type ParsedTimeInfo = DeadlineParseMeta;

export type ExplicitDateResult = {
  date?: Date;
  hasExplicitDate: boolean;
  hasExplicitYear: boolean;
  matchIndex: number;
  matchLength: number;
};

export type ParsedTimeRange = {
  rawText: string;
  startTime: string;
  endTime: string;
  startIndex: number;
  endIndex: number;
  date: Date;
};

type ParsedClock = {
  hour: number;
  minute: number;
  hasExplicitTime: boolean;
  index: number;
  length: number;
};

const deadlineKeywords = [
  "截止",
  "截止时间",
  "截至",
  "之前",
  "前完成",
  "前提交",
  "期末考试",
  "考试安排",
  "考试时间",
  "提交时间",
  "报名截止",
  "完成时间",
];

const eventTimeKeywords = [
  "考试时间",
  "上课时间",
  "会议时间",
  "活动时间",
  "面试时间",
  "开会时间",
  "直播时间",
  "讲座时间",
  "集合时间",
  "时间地点",
];

const eventKeywords = [
  "考试",
  "会议",
  "开会",
  "面试",
  "讲座",
  "上课",
  "活动",
  "集合",
  "培训",
  "答辩",
];
const taskActionKeywords = [
  "提交",
  "上交",
  "发送",
  "发给",
  "发到",
  "发",
  "完成",
  "整理",
  "汇总",
  "准备",
  "负责",
];

const weekdayMap: Record<string, number> = {
  周日: 0,
  星期日: 0,
  周一: 1,
  星期一: 1,
  周二: 2,
  星期二: 2,
  周三: 3,
  星期三: 3,
  周四: 4,
  星期四: 4,
  周五: 5,
  星期五: 5,
  周六: 6,
  星期六: 6,
};

const unknownMeta: DeadlineParseMeta = {
  deadline: "",
  timeType: "unknown",
  hasExplicitDate: false,
  hasExplicitYear: false,
  hasExplicitTime: false,
  hasCompleteDateTime: false,
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function removeUrls(text: string) {
  return stripParsingNoise(text);
}

function buildMonthDayDate(month: number, day: number, baseDate: Date, rollPast: boolean) {
  let date = new Date(baseDate.getFullYear(), month - 1, day);
  if (rollPast && date < startOfDay(baseDate)) {
    date = new Date(baseDate.getFullYear() + 1, month - 1, day);
  }
  return date;
}

export function parseChineseDate(
  text: string,
  baseDate = new Date(),
  options: { rollPast?: boolean } = {},
): ExplicitDateResult {
  const rollPast = options.rollPast ?? true;
  const fullChinese = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?/);
  if (fullChinese) {
    return {
      date: new Date(Number(fullChinese[1]), Number(fullChinese[2]) - 1, Number(fullChinese[3])),
      hasExplicitDate: true,
      hasExplicitYear: true,
      matchIndex: fullChinese.index ?? 0,
      matchLength: fullChinese[0].length,
    };
  }

  const monthDate = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?/);
  if (monthDate) {
    return {
      date: buildMonthDayDate(Number(monthDate[1]), Number(monthDate[2]), baseDate, rollPast),
      hasExplicitDate: true,
      hasExplicitYear: false,
      matchIndex: monthDate.index ?? 0,
      matchLength: monthDate[0].length,
    };
  }

  return {
    hasExplicitDate: false,
    hasExplicitYear: false,
    matchIndex: 0,
    matchLength: 0,
  };
}

export function extractExplicitDate(
  text: string,
  baseDate = new Date(),
  options: { rollPast?: boolean } = {},
): ExplicitDateResult {
  const cleaned = removeUrls(text);
  const fullNumeric = cleaned.match(/(\d{4})\s*[/-]\s*(\d{1,2})\s*[/-]\s*(\d{1,2})/);
  if (fullNumeric) {
    return {
      date: new Date(Number(fullNumeric[1]), Number(fullNumeric[2]) - 1, Number(fullNumeric[3])),
      hasExplicitDate: true,
      hasExplicitYear: true,
      matchIndex: fullNumeric.index ?? 0,
      matchLength: fullNumeric[0].length,
    };
  }

  const chineseDate = parseChineseDate(cleaned, baseDate, options);
  if (chineseDate.hasExplicitDate) return chineseDate;

  const slashMonthDate = cleaned.match(/(?:^|[^\d])(\d{1,2})\s*\/\s*(\d{1,2})(?:[^\d]|$)/);
  if (slashMonthDate) {
    const leadingOffset = slashMonthDate[0].match(/^\D/) ? 1 : 0;
    return {
      date: buildMonthDayDate(
        Number(slashMonthDate[1]),
        Number(slashMonthDate[2]),
        baseDate,
        options.rollPast ?? true,
      ),
      hasExplicitDate: true,
      hasExplicitYear: false,
      matchIndex: (slashMonthDate.index ?? 0) + leadingOffset,
      matchLength: slashMonthDate[0].trim().length,
    };
  }

  return chineseDate;
}

export function parseTimeWithPeriod(period: string | undefined, rawHour: number, minute = 0) {
  let hour = rawHour;

  if ((period === "下午" || period === "晚上") && hour < 12) hour += 12;
  if (period === "中午" && hour < 11) hour += 12;
  if (period === "上午" && hour === 12) hour = 0;

  return { hour, minute };
}

function dateWithTime(date: Date, hour: number, minute: number) {
  const next = startOfDay(date);
  next.setHours(hour, minute, 0, 0);
  return next;
}

function getNextWeekday(baseDate: Date, weekday: number, forceNextWeek: boolean) {
  const base = startOfDay(baseDate);
  const current = base.getDay();
  let offset = weekday - current;

  if (forceNextWeek) {
    offset += offset <= 0 ? 7 : 7;
  } else if (offset < 0) {
    offset += 7;
  }

  return addDays(base, offset);
}

function parseRelativeDate(text: string, baseDate: Date) {
  let targetDate = startOfDay(baseDate);

  if (text.includes("后天")) return addDays(targetDate, 2);
  if (text.includes("明天")) return addDays(targetDate, 1);
  if (text.includes("今天")) return targetDate;

  const weekdayToken = Object.keys(weekdayMap).find((token) => text.includes(token));
  if (weekdayToken) {
    targetDate = getNextWeekday(
      targetDate,
      weekdayMap[weekdayToken],
      text.includes(`下${weekdayToken}`) || text.includes("下周"),
    );
  }

  return targetDate;
}

function hasRelativeDateSignal(text: string) {
  return /今天|明天|后天|下周|周[一二三四五六日]|星期[一二三四五六日]/.test(text);
}

function parseSingleTime(text: string, startIndex = 0): ParsedClock {
  const scopedText = text.slice(startIndex);
  const colonTime = scopedText.match(/(上午|中午|下午|晚上)?\s*(\d{1,2})\s*[:：]\s*(\d{1,2})/);
  if (colonTime) {
    const parsed = parseTimeWithPeriod(colonTime[1], Number(colonTime[2]), Number(colonTime[3]));
    return {
      ...parsed,
      hasExplicitTime: true,
      index: startIndex + (colonTime.index ?? 0),
      length: colonTime[0].length,
    };
  }

  const chineseTime = scopedText.match(
    /(上午|中午|下午|晚上)?\s*(\d{1,2})\s*点\s*(\d{1,2})?\s*分?/,
  );
  if (chineseTime) {
    const parsed = parseTimeWithPeriod(
      chineseTime[1],
      Number(chineseTime[2]),
      chineseTime[3] ? Number(chineseTime[3]) : 0,
    );
    return {
      ...parsed,
      hasExplicitTime: true,
      index: startIndex + (chineseTime.index ?? 0),
      length: chineseTime[0].length,
    };
  }

  return { hour: 18, minute: 0, hasExplicitTime: false, index: 0, length: 0 };
}

export function extractTimeRanges(
  text: string,
  contextDate: Date,
  startIndex = 0,
): ParsedTimeRange[] {
  const scopedText = removeUrls(text).slice(startIndex);
  const rangePattern =
    /(上午|中午|下午|晚上)?\s*(\d{1,2})\s*(?::|：|点)\s*(\d{0,2})\s*(?:分)?\s*(?:-|~|至|到)\s*(上午|中午|下午|晚上)?\s*(\d{1,2})\s*(?::|：|点)\s*(\d{0,2})\s*(?:分)?/g;
  const ranges: ParsedTimeRange[] = [];

  for (const match of scopedText.matchAll(rangePattern)) {
    const startPeriod = match[1];
    const endPeriod = match[4] ?? startPeriod;
    const startClock = parseTimeWithPeriod(
      startPeriod,
      Number(match[2]),
      match[3] ? Number(match[3]) : 0,
    );
    const endClock = parseTimeWithPeriod(
      endPeriod,
      Number(match[5]),
      match[6] ? Number(match[6]) : 0,
    );
    const startDate = dateWithTime(contextDate, startClock.hour, startClock.minute);
    let endDate = dateWithTime(contextDate, endClock.hour, endClock.minute);
    if (endDate <= startDate) endDate = addDays(endDate, 1);

    const localStart = match.index ?? 0;
    ranges.push({
      rawText: match[0],
      startTime: formatDateTime(startDate),
      endTime: formatDateTime(endDate),
      startIndex: startIndex + localStart,
      endIndex: startIndex + localStart + match[0].length,
      date: contextDate,
    });
  }

  return ranges;
}

export function inheritContextDate<T extends { text: string; date?: Date }>(
  items: T[],
  baseDate = new Date(),
) {
  let contextDate: Date | undefined;

  return items.map((item) => {
    const explicitDate = extractExplicitDate(item.text, baseDate, { rollPast: false });
    if (explicitDate.date) contextDate = explicitDate.date;
    return { ...item, date: item.date ?? contextDate };
  });
}

export function extractContextDate(text: string, baseDate = new Date()) {
  const explicitDate = extractExplicitDate(text, baseDate, { rollPast: false });
  if (explicitDate.date) return explicitDate.date;
  return hasRelativeDateSignal(text) ? parseRelativeDate(text, baseDate) : undefined;
}

export function detectTimeType(text: string): TimeType {
  const cleaned = removeUrls(text);
  if (
    eventTimeKeywords.some((keyword) => cleaned.includes(keyword)) ||
    eventKeywords.some((keyword) => cleaned.includes(keyword))
  ) {
    return "event";
  }

  if (deadlineKeywords.some((keyword) => cleaned.includes(keyword))) {
    return "deadline";
  }

  return "unknown";
}

export function isEventTimeText(text: string) {
  return detectTimeType(text) === "event";
}

export function parseDeadlineMetaFromText(
  inputText: string,
  baseDate = new Date(),
): DeadlineParseMeta {
  const normalizedText = removeUrls(inputText.trim());
  const explicitDate = extractExplicitDate(normalizedText, baseDate);
  const dateStartIndex = explicitDate.matchIndex + explicitDate.matchLength;
  const date = explicitDate.date ?? parseRelativeDate(normalizedText, baseDate);
  const ranges = extractTimeRanges(
    normalizedText,
    date,
    explicitDate.hasExplicitDate ? dateStartIndex : 0,
  );
  const singleTime = parseSingleTime(
    normalizedText,
    explicitDate.hasExplicitDate ? dateStartIndex : 0,
  );
  const detectedTimeType = detectTimeType(normalizedText);
  const hasAnyDate = explicitDate.hasExplicitDate || hasRelativeDateSignal(normalizedText);
  const hasTaskAction = taskActionKeywords.some((keyword) => normalizedText.includes(keyword));
  const timeType =
    detectedTimeType === "event" && hasTaskAction && /前|之前|截止/.test(normalizedText)
      ? "deadline"
      : detectedTimeType === "unknown" &&
          hasTaskAction &&
          (singleTime.hasExplicitTime || hasAnyDate)
        ? "deadline"
        : detectedTimeType;

  if (timeType === "unknown") return unknownMeta;

  if (!hasAnyDate && !singleTime.hasExplicitTime && ranges.length === 0) {
    return unknownMeta;
  }

  if (timeType === "event" && ranges[0]) {
    return {
      deadline: "",
      startTime: ranges[0].startTime,
      endTime: ranges[0].endTime,
      timeType,
      hasExplicitDate: explicitDate.hasExplicitDate,
      hasExplicitYear: explicitDate.hasExplicitYear,
      hasExplicitTime: true,
      hasCompleteDateTime: explicitDate.hasExplicitDate,
    };
  }

  let targetDate = dateWithTime(date, singleTime.hour, singleTime.minute);
  if (!hasAnyDate && singleTime.hasExplicitTime && targetDate <= baseDate) {
    targetDate = addDays(targetDate, 1);
  }

  return {
    deadline: timeType === "event" ? "" : formatDateTime(targetDate),
    startTime: timeType === "event" ? formatDateTime(targetDate) : undefined,
    timeType,
    hasExplicitDate: explicitDate.hasExplicitDate,
    hasExplicitYear: explicitDate.hasExplicitYear,
    hasExplicitTime: singleTime.hasExplicitTime,
    hasCompleteDateTime: explicitDate.hasExplicitDate && singleTime.hasExplicitTime,
  };
}

export function parseTimeInfo(text: string, baseDate = new Date()): ParsedTimeInfo {
  return parseDeadlineMetaFromText(text, baseDate);
}

export function parseDeadlineFromText(inputText: string, baseDate = new Date()) {
  return parseDeadlineMetaFromText(inputText, baseDate).deadline;
}

export function parseDeadlineDate(deadline: string) {
  return new Date(deadline.replace(" ", "T"));
}
