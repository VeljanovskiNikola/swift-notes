import type { PostSummary } from "@/lib/posts";

interface FilterOptions {
  query?: string;
  tag?: string | null;
}

/** Filter posts by tag and by a text search over title, excerpt and tags. */
export function filterPosts<T extends Pick<PostSummary, "title" | "excerpt" | "tags">>(
  posts: T[],
  { query = "", tag = null }: FilterOptions,
): T[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false;
    if (terms.length === 0) return true;
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
