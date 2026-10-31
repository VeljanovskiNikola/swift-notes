/** Average adult reading speed for technical prose. */
export const WORDS_PER_MINUTE = 200;

/** Count the words in a Markdown/MDX string, ignoring syntax characters. */
export function countWords(markdown: string): number {
  const text = markdown
    // drop MDX/HTML tags and import/export lines
    .replace(/^\s*(import|export)\s.*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    // drop link/image URLs but keep their text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    // drop Markdown punctuation
    .replace(/[`*_>#~|=-]+/g, " ");
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.]*/gu);
  return words ? words.length : 0;
}

/** Minutes to read, rounded up, never less than 1. */
export function readingTime(markdown: string, wpm = WORDS_PER_MINUTE): number {
  return Math.max(1, Math.ceil(countWords(markdown) / wpm));
}
