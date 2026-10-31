import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { sortTags } from "@/config/tags";
import { readingTime } from "@/lib/read-time";

export const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * The frontmatter every post must have. A post that breaks these
 * rules stops the build with a clear error, so a typo never ships.
 */
export const frontmatterSchema = z.object({
  title: z.string({ error: "title is required" }).trim().min(1, "title is required"),
  excerpt: z.string({ error: "excerpt is required" }).trim().min(1, "excerpt is required"),
  // YAML turns unquoted dates into Date objects, so accept both.
  date: z
    .union([z.string(), z.date()], { error: "date is required, e.g. 2026-03-27" })
    .transform((value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value))
    .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must look like 2026-03-27")),
  tags: z
    .array(z.string().trim().min(1), { error: "tags must be a list, e.g. [Swift, SwiftUI]" })
    .min(1, "add at least one tag"),
  draft: z.boolean().default(false),
  /** Optional: overrides the automatic read time (in minutes). */
  readTime: z.number().int().positive().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  draft: boolean;
  readTime: number;
}

export interface Post extends PostSummary {
  /** Raw MDX body, without frontmatter. */
  content: string;
}

export interface LoadOptions {
  includeDrafts?: boolean;
}

/** Turn one MDX file into a Post. Throws a readable error if it's invalid. */
export function parsePost(fileName: string, raw: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `[posts] "${fileName}": file names become URLs, so use lowercase letters, numbers and dashes (e.g. my-new-post.mdx).`,
    );
  }

  const { data, content } = matter(raw);
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("\n");
    throw new Error(`[posts] "${fileName}" has invalid frontmatter:\n${issues}`);
  }

  const fm = result.data;
  return {
    slug,
    title: fm.title,
    excerpt: fm.excerpt,
    date: fm.date,
    tags: fm.tags,
    draft: fm.draft,
    readTime: fm.readTime ?? readingTime(content),
    content,
  };
}

/** Read every post in a folder, newest first. */
export function loadPosts(dir: string, { includeDrafts = false }: LoadOptions = {}): Post[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => parsePost(file, fs.readFileSync(path.join(dir, file), "utf8")))
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/** Drafts show up in `npm run dev` but never in a production build. */
const showDrafts = process.env.NODE_ENV !== "production";

let cache: Post[] | undefined;

export function getAllPosts(): Post[] {
  cache ??= loadPosts(POSTS_DIR, { includeDrafts: showDrafts });
  return cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Post data without the body: small enough to send to the browser. */
export function toSummary(post: Post): PostSummary {
  const { slug, title, excerpt, date, tags, draft, readTime } = post;
  return { slug, title, excerpt, date, tags, draft, readTime };
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map(toSummary);
}

/** Every tag used by at least one post, in display order. */
export function getAllTags(posts: Pick<PostSummary, "tags">[] = getAllPosts()): string[] {
  return sortTags(posts.flatMap((post) => post.tags));
}
