import { describe, expect, it } from "vitest";
import { countWords, readingTime, WORDS_PER_MINUTE } from "@/lib/read-time";

describe("countWords", () => {
  it("counts plain words", () => {
    expect(countWords("Swift makes concurrency safe")).toBe(4);
  });

  it("ignores Markdown syntax", () => {
    expect(countWords("## Title\n\n- **bold** item\n> quote")).toBe(4);
  });

  it("keeps link text but drops the URL", () => {
    expect(countWords("Read [the docs](https://swift.org/documentation/) now")).toBe(4);
  });

  it("ignores MDX import lines and tags", () => {
    expect(countWords('import X from "./x"\n\n<Quote>Hello world</Quote>')).toBe(2);
  });

  it("returns 0 for empty text", () => {
    expect(countWords("")).toBe(0);
  });
});

describe("readingTime", () => {
  const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");

  it("is at least 1 minute", () => {
    expect(readingTime("")).toBe(1);
    expect(readingTime("one two three")).toBe(1);
  });

  it("rounds up to the next minute", () => {
    expect(readingTime(words(WORDS_PER_MINUTE))).toBe(1);
    expect(readingTime(words(WORDS_PER_MINUTE + 1))).toBe(2);
    expect(readingTime(words(WORDS_PER_MINUTE * 5))).toBe(5);
  });

  it("accepts a custom reading speed", () => {
    expect(readingTime(words(300), 100)).toBe(3);
  });
});
