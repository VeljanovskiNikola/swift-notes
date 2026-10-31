import { describe, expect, it } from "vitest";
import {
  defaultTagColor,
  getTagColor,
  getTagStyle,
  hexToRgba,
  mixWithWhite,
  sortTags,
} from "@/config/tags";
import { filterPosts } from "@/lib/filter-posts";
import { formatDate } from "@/lib/format";
import { buildRssFeed, escapeXml } from "@/lib/rss";

describe("tags", () => {
  it("uses the configured color for known tags", () => {
    expect(getTagColor("SwiftUI")).toBe("#0A84FF");
    expect(getTagStyle("Career")).toEqual({
      color: mixWithWhite("#30D158", 0.2),
      background: "rgba(48, 209, 88, 0.2)",
    });
  });

  it("falls back to the default color for unknown tags", () => {
    expect(getTagColor("Kotlin")).toBe(defaultTagColor);
    expect(getTagStyle("Kotlin").color).toBe(mixWithWhite(defaultTagColor, 0.2));
  });

  it("converts hex to rgba", () => {
    expect(hexToRgba("#FF9F0A", 0.5)).toBe("rgba(255, 159, 10, 0.5)");
    expect(hexToRgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
  });

  it("mixes colors toward white", () => {
    expect(mixWithWhite("#000000", 0.5)).toBe("#808080");
    expect(mixWithWhite("#BF5AF2", 0)).toBe("#BF5AF2");
    expect(mixWithWhite("#BF5AF2", 1)).toBe("#FFFFFF");
  });

  it("sorts configured tags first and removes duplicates", () => {
    expect(sortTags(["Zeta", "Career", "Swift", "Alpha", "Swift"])).toEqual([
      "Swift",
      "Career",
      "Alpha",
      "Zeta",
    ]);
  });
});

describe("filterPosts", () => {
  const posts = [
    { title: "Actors in Swift", excerpt: "Data races", tags: ["Concurrency"] },
    { title: "Design tokens", excerpt: "SwiftUI systems", tags: ["SwiftUI"] },
  ];

  it("returns everything with no filters", () => {
    expect(filterPosts(posts, {})).toHaveLength(2);
  });

  it("filters by tag", () => {
    expect(filterPosts(posts, { tag: "SwiftUI" }).map((p) => p.title)).toEqual(["Design tokens"]);
  });

  it("searches title, excerpt and tags, ignoring case", () => {
    expect(filterPosts(posts, { query: "ACTORS" })).toHaveLength(1);
    expect(filterPosts(posts, { query: "races" })).toHaveLength(1);
    expect(filterPosts(posts, { query: "concurrency" })).toHaveLength(1);
  });

  it("needs every search word to match", () => {
    expect(filterPosts(posts, { query: "design swiftui" })).toHaveLength(1);
    expect(filterPosts(posts, { query: "design actors" })).toHaveLength(0);
  });
});

describe("formatDate", () => {
  it("formats ISO dates without time zone shifts", () => {
    expect(formatDate("2026-03-27")).toBe("March 27, 2026");
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
  });
});

describe("RSS", () => {
  it("escapes XML characters", () => {
    expect(escapeXml(`Tom & "Jerry" <3`)).toBe("Tom &amp; &quot;Jerry&quot; &lt;3");
  });

  it("includes published posts and skips drafts", () => {
    const xml = buildRssFeed([
      {
        slug: "a",
        title: "A & B",
        excerpt: "x",
        date: "2026-03-01",
        tags: ["Swift"],
        draft: false,
        readTime: 1,
      },
      {
        slug: "b",
        title: "Secret",
        excerpt: "x",
        date: "2026-03-02",
        tags: ["Swift"],
        draft: true,
        readTime: 1,
      },
    ]);
    expect(xml).toContain("<title>A &amp; B</title>");
    expect(xml).toContain("/post/a</link>");
    expect(xml).not.toContain("Secret");
  });
});
