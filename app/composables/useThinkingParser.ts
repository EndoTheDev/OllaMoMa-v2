export function parseThinking(content: string): {
  thinking: string | null;
  cleanContent: string;
} {
  const thinkStart = content.indexOf("<think>");
  const thinkEnd = content.indexOf("</think>");

  if (thinkStart !== -1 && thinkEnd !== -1 && thinkEnd > thinkStart) {
    const thinking = content.substring(thinkStart + 7, thinkEnd).trim();
    const beforeThink = content.substring(0, thinkStart);
    const afterThink = content.substring(thinkEnd + 8);
    const cleanContent = (beforeThink + afterThink).trim();

    return { thinking, cleanContent };
  }

  return { thinking: null, cleanContent: content };
}
