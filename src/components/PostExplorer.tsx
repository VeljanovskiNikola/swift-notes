"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/lib/posts";
import { filterPosts } from "@/lib/filter-posts";
import { PostCard } from "@/components/PostCard";
import { SearchInput } from "@/components/SearchInput";
import { TagFilter } from "@/components/TagFilter";

interface PostExplorerProps {
  posts: PostSummary[];
  tags: string[];
}

/** Search box + tag chips + post grid. All posts are in the static HTML. */
export function PostExplorer({ posts, tags }: PostExplorerProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const visible = useMemo(() => filterPosts(posts, { query, tag }), [posts, query, tag]);

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <TagFilter tags={tags} active={tag} onChange={setTag} />
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "post" : "posts"} shown
      </p>
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-muted py-12 text-center">No posts found.</p>
      )}
    </>
  );
}
