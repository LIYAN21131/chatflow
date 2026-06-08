export function parseLocation(text: string) {
  const patterns = [
    /(?:考试地点|会议地点|活动地点|地点)[:：]?\s*([A-Za-z0-9一-龥楼室教室\-]+)/,
    /会议室\s*([A-Za-z0-9一-龥楼室教室\-]+)/,
    /(?<!关)(?:在|于)\s*([A-Za-z0-9]{1,4}\d{2,4})(?=开会|会议|考试|上课|。|\.|,|，|\s|$)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const location = match?.[1]?.replace(/[。,.，；;、]$/, "").trim();
    if (location) return location;
  }

  return undefined;
}
