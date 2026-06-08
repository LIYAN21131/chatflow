export type CleanedText = {
  originalText: string;
  textForParsing: string;
};

export function removeUrls(text: string) {
  return text
    .replace(/https?:\/\/[^\s，。；、)）]+/gi, "")
    .replace(/\b(?:channelid|infoid|id|page|code|token)=\d+\b/gi, "");
}

export function normalizePunctuation(text: string) {
  return text
    .replace(/：/g, ":")
    .replace(/；/g, ";")
    .replace(/，/g, ",")
    .replace(/。/g, ".")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/【/g, "[")
    .replace(/】/g, "]")
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'");
}

export function cleanText(rawText: string): CleanedText {
  const originalText = rawText.trim();
  const textForParsing = normalizePunctuation(removeUrls(originalText))
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  return { originalText, textForParsing };
}

export function stripParsingNoise(text: string) {
  return removeUrls(normalizePunctuation(text))
    .replace(/\b\d{4}-\d{4}-\d+\b/g, "")
    .replace(/\b(?:channelid|infoid|id|page|code|token)=\d+\b/gi, "")
    .replace(/课程编号[:：]?\s*\w+/g, "")
    .replace(/通知编号[:：]?\s*\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
