// Utility functions for cleaning AI-generated responses

/**
 * Removes AI meta-commentary and explanatory text patterns
 */
export const cleanAIMetaCommentary = (text: string): string => {
  return text
    .replace(/^.*?By incorporating.*?\./gm, '')
    .replace(/^.*?This analysis.*?\./gm, '')
    .replace(/^.*?The (improved|enhanced|updated).*?\./gm, '')
    .replace(/^.*?This approach.*?\./gm, '')
    .replace(/^.*?(provides|offers|gives).*?(perspective|insight|analysis).*?\./gm, '')
    .replace(/^.*?Based on.*?[:.]\s*/gm, '')
    .replace(/^.*?Here('s|\s+is).*?[:.]\s*/gm, '')
    .replace(/^\s*[-*]\s*/gm, '')
    .trim();
};

/**
 * Cleans and formats analysis text
 */
export const cleanAnalysisText = (text: string): string => {
  const cleaned = cleanAIMetaCommentary(text);
  
  // Remove empty lines and ensure proper spacing
  return cleaned
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n\n')
    .trim();
};