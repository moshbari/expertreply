// Utility functions for cleaning and formatting AI-generated text

/**
 * Removes markdown syntax from text
 */
export const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
    .replace(/#{1,6}\s/g, '')        // Remove headers
    .replace(/`(.*?)`/g, '$1')       // Remove inline code
    .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url)
    .replace(/^\s*[-*+]\s/gm, '')    // Remove bullet points
    .replace(/^\s*\d+\.\s/gm, '')    // Remove numbered lists
    .trim();
};

/**
 * Cleans AI-generated text by removing common AI artifacts
 */
export const cleanAIText = (text: string): string => {
  return text
    .replace(/^-\s*/gm, '')          // Remove dashes at start of lines
    .replace(/^\*\s*/gm, '')         // Remove asterisks at start of lines
    .replace(/Here's\s+/gi, '')      // Remove "Here's"
    .replace(/Here\s+is\s+/gi, '')   // Remove "Here is"
    .replace(/^Based on.*?[:.]\s*/gi, '') // Remove "Based on..." intros
    .replace(/\b(AI|GPT|ChatGPT|artificial intelligence)\b/gi, '') // Remove AI references
    .trim();
};

/**
 * Extracts meaningful titles from content, avoiding repetition
 */
export const extractTitle = (content: string, maxLength: number = 40): string => {
  const cleaned = stripMarkdown(content);
  const sentences = cleaned.split(/[.!?]/).filter(s => s.trim());
  
  if (sentences.length === 0) return 'Analysis Point';
  
  let title = sentences[0].trim();
  
  // Remove common question words and make it more title-like
  title = title
    .replace(/^(what|why|how|when|where|who)\s+/gi, '')
    .replace(/^(the|this|that|these|those)\s+/gi, '');
  
  if (title.length > maxLength) {
    title = title.substring(0, maxLength).trim() + '...';
  }
  
  return title.charAt(0).toUpperCase() + title.slice(1);
};