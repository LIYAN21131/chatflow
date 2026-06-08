import type { TaskIntent } from "@/types/task";
import { stripParsingNoise } from "@/lib/textCleaner";

function trimSummary(text: string) {
  const cleaned = text.trim();
  if (cleaned.length <= 28) return cleaned;
  return `${cleaned.slice(0, 27)}…`;
}

export function cleanGeneratedTitle(title: string) {
  return stripParsingNoise(title)
    .replace(
      /(上午|中午|下午|晚上)?\s*\d{1,2}\s*(?::|：|点)\s*\d{0,2}\s*(?:分)?\s*(?:-|~|至|到)\s*(上午|中午|下午|晚上)?\s*\d{1,2}\s*(?::|：|点)\s*\d{0,2}\s*(?:分)?/g,
      "",
    )
    .replace(/(\d{4}\s*年\s*)?\d{1,2}\s*月\s*\d{1,2}\s*[日号]?/g, "")
    .replace(/(\d{4}\s*[/-]\s*)?\d{1,2}\s*[/-]\s*\d{1,2}/g, "")
    .replace(/(今天|明天|后天|本周|下周|周[一二三四五六日]|星期[一二三四五六日])/g, "")
    .replace(/(上午|中午|下午|晚上)?\s*\d{1,2}\s*[:：]\s*\d{1,2}/g, "")
    .replace(/(上午|中午|下午|晚上)?\s*\d{1,2}\s*点\s*\d{0,2}\s*分?/g, "")
    .replace(/[-~至到]\s*\d{1,2}\s*(?::|：|点)?\s*\d{0,2}\s*分?/g, "")
    .replace(/考试时间|会议时间|上课时间|活动时间|面试时间|讲座时间|集合时间|时间地点如下/g, "")
    .replace(/请|大家|及时|记得|麻烦|一下|把/g, "")
    .replace(/[:：,，。.;；]+/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function extractNoticeTitle(text: string) {
  if (/通识选修课程|在线课程|通识选修课|期末考试安排/.test(text)) {
    return "查看通识选修课期末考试安排";
  }
  if (/考试安排|期末考试/.test(text)) return "查看期末考试安排";

  const notice = text.match(/[《"]([^》"]{4,42})[》"]/);
  if (notice) {
    const subject = cleanGeneratedTitle(notice[1])
      .replace(/的通知$/, "")
      .replace(/通知$/, "");
    if (subject.includes("安排")) return `查看${subject}`;
    return `查看${subject}通知`;
  }

  return "查看相关通知";
}

function extractCourse(text: string) {
  const cleaned = cleanGeneratedTitle(text)
    .replace(/考试地点[A-Za-z0-9一-龥楼室教室\-]+/g, "")
    .replace(/地点[A-Za-z0-9一-龥楼室教室\-]+/g, "")
    .replace(/考试|重修考试|参加/g, "")
    .trim();
  return cleaned || "";
}

export function generateTitleAndSummary(
  segmentText: string,
  contextText: string,
  intent: TaskIntent,
) {
  const text = stripParsingNoise(segmentText);
  const context = stripParsingNoise(contextText);
  let title = "";

  if (intent === "view_notice") {
    title = extractNoticeTitle(context);
  } else if (intent === "event") {
    if (/通知|安排/.test(context) && /通识选修|期末考试|考试安排/.test(context)) {
      title = extractNoticeTitle(context);
      const cleanedTitle = cleanGeneratedTitle(title) || "查看相关通知";
      return {
        title: cleanedTitle,
        summary: trimSummary(cleanedTitle),
      };
    }

    const course = extractCourse(text);
    if (/会议|开会/.test(context)) title = "参加会议";
    else if (/面试/.test(context)) title = "参加面试";
    else if (/讲座/.test(context)) title = "参加讲座";
    else if (/上课/.test(context)) title = "参加课程";
    else if (/考试/.test(context)) {
      title = course ? `参加${course}${/重修/.test(context) ? "重修考试" : "考试"}` : "参加考试";
    } else title = "参加活动";
  } else if (/实验报告/.test(text)) title = "提交实验报告";
  else if (/小组汇报PPT|汇报PPT/.test(text)) title = "提交小组汇报PPT";
  else if (/PPT/i.test(text) && intent === "assign") {
    const owner = text.match(/([\u4e00-\u9fa5]{2,4})负责/)?.[1];
    title = owner ? `${owner}完成PPT` : "完成PPT";
  } else if (/PPT/i.test(text) && (intent === "submit" || intent === "send")) title = "提交PPT";
  else if (/用户调研结果|调研结果/.test(text)) title = "整理用户调研结果";
  else {
    const action = text.match(/(提交|上交|整理|汇总|发送|发给|发到|完成|准备|负责)(.{2,30})/);
    if (action) {
      const normalizedAction =
        action[1] === "上交" || action[1] === "发送" || action[1] === "发给" || action[1] === "发到"
          ? "提交"
          : action[1] === "负责"
            ? "完成"
            : action[1];
      title = `${normalizedAction}${action[2].replace(/给.*|到.*|前.*|之前.*|,.*|，.*/g, "")}`;
    }
  }

  const cleanedTitle = cleanGeneratedTitle(title) || (intent === "unknown" ? "" : "查看相关通知");
  return {
    title: cleanedTitle,
    summary: trimSummary(cleanedTitle),
  };
}
