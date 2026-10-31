import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getAllTags, loadPosts, parsePost, POSTS_DIR, toSummary } from "@/lib/posts";

const post = (frontmatter: string, body = "Some body text.") =>
  `---\n${frontmatter}\n---\n\n${body}\n`;

const valid = post(`title: "Hello"
excerpt: "A short summary."
date: 2026-05-01
tags: [Swift]`);

describe("parsePost", () => {
  it("parses a valid post and uses the file name as slug", () => {
    const result = parsePost("hello-world.mdx", valid);
    expect(result.slug).toBe("hello-world");
    expect(result.title).toBe("Hello");
    expect(result.date).toBe("2026-05-01");
    expect(result.tags).toEqual(["Swift"]);
    expect(result.draft).toBe(false);
    expect(result.content.trim()).toBe("Some body text.");
  });

  it("calculates read time when it isn't set", () => {
    expect(parsePost("a.mdx", valid).readTime).toBe(1);
  });

  it("uses readTime from frontmatter when set", () => {
    const withOverride = post(`title: "Hi"
excerpt: "x"
date: 2026-05-01
tags: [Swift]
readTime: 7`);
    expect(parsePost("a.mdx", withOverride).readTime).toBe(7);
  });

  it("accepts quoted dates", () => {
    const quoted = post(`title: "Hi"
excerpt: "x"
date: "2026-05-01"
tags: [Swift]`);
    expect(parsePost("a.mdx", quoted).date).toBe("2026-05-01");
  });

  it("fails with a clear message when fields are missing", () => {
    const broken = post(`title: "Hi"
date: 2026-05-01
tags: []`);
    expect(() => parsePost("broken.mdx", broken)).toThrowError(
      /"broken\.mdx" has invalid frontmatter[\s\S]*excerpt[\s\S]*tags/,
    );
  });

  it("rejects a badly formatted date", () => {
    const badDate = post(`title: "Hi"
excerpt: "x"
date: "May 1st"
tags: [Swift]`);
    expect(() => parsePost("a.mdx", badDate)).toThrowError(/date/);
  });

  it("rejects file names that would make bad URLs", () => {
    expect(() => parsePost("My Post.mdx", valid)).toThrowError(/lowercase letters/);
  });
});

describe("loadPosts", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "posts-"));
    const write = (name: string, content: string) =>
      fs.writeFileSync(path.join(dir, name), content);
    write("older.mdx", post(`title: "Older"\nexcerpt: "x"\ndate: 2026-01-01\ntags: [Career]`));
    write(
      "newer.mdx",
      post(`title: "Newer"\nexcerpt: "x"\ndate: 2026-04-01\ntags: [Swift, NewTag]`),
    );
    write(
      "draft-post.mdx",
      post(`title: "Draft"\nexcerpt: "x"\ndate: 2026-06-01\ntags: [Swift]\ndraft: true`),
    );
    write("notes.txt", "not a post");
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("loads posts newest first and skips non-MDX files", () => {
    expect(loadPosts(dir).map((p) => p.slug)).toEqual(["newer", "older"]);
  });

  it("hides drafts unless asked", () => {
    expect(loadPosts(dir).some((p) => p.draft)).toBe(false);
    expect(loadPosts(dir, { includeDrafts: true }).map((p) => p.slug)).toEqual([
      "draft-post",
      "newer",
      "older",
    ]);
  });

  it("returns an empty list for a missing folder", () => {
    expect(loadPosts(path.join(dir, "missing"))).toEqual([]);
  });

  it("collects tags: configured ones first, then new ones A–Z", () => {
    expect(getAllTags(loadPosts(dir))).toEqual(["Swift", "Career", "NewTag"]);
  });

  it("toSummary drops the post body", () => {
    const [first] = loadPosts(dir);
    expect(first).toBeDefined();
    expect(toSummary(first!)).not.toHaveProperty("content");
  });
});

describe("real content", () => {
  it("every post in content/posts is valid", () => {
    const posts = loadPosts(POSTS_DIR, { includeDrafts: true });
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.readTime).toBeGreaterThan(0);
    }
  });
});
