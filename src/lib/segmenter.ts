export type TextSegment = {
  sourceText: string;
  parsingText: string;
  contextText: string;
};

const timeRangePattern =
  /(上午|中午|下午|晚上)?\s*\d{1,2}\s*(?::|：|点)\s*\d{0,2}\s*(?:分)?\s*(?:-|~|至|到)\s*(上午|中午|下午|晚上)?\s*\d{1,2}\s*(?::|：|点)\s*\d{0,2}\s*(?:分)?/;

function normalizeSegment(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function withStop(text: string) {
  return /[。.!！?？]$/.test(text) ? text : `${text}。`;
}

function splitLineToParts(line: string) {
  return line
    .split(/。|；|;|\n/)
    .flatMap((sentence) => sentence.split(/，|,/))
    .map(normalizeSegment)
    .filter(Boolean);
}

function shouldKeepContext(part: string) {
  return /时间地点|地点如下|通知|安排|发布|链接|第[一二三四五六七八九十]+周|今天|明天|后天|本周|下周|周[一二三四五六日]|星期[一二三四五六日]|\d{1,2}月\d{1,2}[日号]?|\d{4}年\d{1,2}月\d{1,2}[日号]?/.test(
    part,
  );
}

function isTaskLike(part: string) {
  return /提交|上交|发送|发给|发到|整理|汇总|完成|负责|截止|报名|通知|查看|考试|会议|开会|面试|讲座|上课|活动|集合|培训|答辩|PPT|报告|作业|论文|调研/.test(
    part,
  );
}

export function segmentText(
  originalText: string,
  textForParsing: string,
  maxTasks = 10,
): TextSegment[] {
  const parsingParts = splitLineToParts(textForParsing);
  const segments: TextSegment[] = [];
  let contextText = "";

  for (let index = 0; index < parsingParts.length && segments.length < maxTasks; index += 1) {
    const parsingPart = parsingParts[index];

    if (shouldKeepContext(parsingPart)) {
      contextText = contextText ? `${contextText} ${parsingPart}` : parsingPart;
    }

    if (/时间地点如下|地点如下|通知参加/.test(parsingPart)) {
      continue;
    }

    if (timeRangePattern.test(parsingPart)) {
      const collectedParsing = [parsingPart];
      let consumedUntil = index;

      for (let next = index + 1; next < parsingParts.length; next += 1) {
        if (timeRangePattern.test(parsingParts[next])) break;
        collectedParsing.push(parsingParts[next]);
        consumedUntil = next;
        if (/地点|考试地点|会议地点|活动地点|会议室|在|于/.test(parsingParts[next])) break;
      }

      const sourceText = withStop(collectedParsing.join("，"));
      segments.push({
        sourceText,
        parsingText: collectedParsing.join("，"),
        contextText: contextText
          ? `${contextText} ${collectedParsing.join("，")}`
          : collectedParsing.join("，"),
      });
      index = consumedUntil;
      continue;
    }

    if (isTaskLike(parsingPart) && !/^(考试地点|会议地点|活动地点|地点)[:：]?/.test(parsingPart)) {
      if (
        /(负责|分工|截止|报名截止)/.test(parsingPart) &&
        parsingParts[index + 1] &&
        /今天|明天|后天|截止|之前|前|发给|发到|提交|申请|报名/.test(parsingParts[index + 1])
      ) {
        const mergedText = `${parsingPart}，${parsingParts[index + 1]}`;
        segments.push({
          sourceText: withStop(mergedText),
          parsingText: mergedText,
          contextText: contextText ? `${contextText} ${mergedText}` : mergedText,
        });
        index += 1;
        continue;
      }

      segments.push({
        sourceText: withStop(parsingPart),
        parsingText: parsingPart,
        contextText: contextText ? `${contextText} ${parsingPart}` : parsingPart,
      });
    }
  }

  return mergeEventTimeWithNotice(segments).slice(0, maxTasks);
}

function mergeEventTimeWithNotice(segments: TextSegment[]) {
  return segments.reduce<TextSegment[]>((merged, segment) => {
    const previous = merged[merged.length - 1];
    const shouldMerge =
      previous &&
      /通知|安排|发布|链接/.test(previous.parsingText) &&
      /^(考试时间|会议时间|上课时间|活动时间|面试时间|讲座时间|集合时间)[:：]?/.test(
        segment.parsingText,
      );

    if (shouldMerge) {
      merged[merged.length - 1] = {
        sourceText: `${previous.sourceText}${segment.sourceText}`,
        parsingText: `${previous.parsingText} ${segment.parsingText}`,
        contextText: `${previous.contextText} ${segment.contextText}`,
      };
      return merged;
    }

    merged.push(segment);
    return merged;
  }, []);
}
