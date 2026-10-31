import type { PostSummary } from "@/lib/posts";
import { Card } from "@/components/Card";
import { PostMeta } from "@/components/PostMeta";
import { TagList } from "@/components/TagPill";

export function PostCard({ post, index = 0 }: { post: PostSummary; index?: number }) {
  return (
    <Card
      href={`/post/${post.slug}`}
      index={index}
      className="p-5"
      labelledBy={`post-${post.slug}-title`}
    >
      <div>
        <TagList tags={post.tags} className="mb-3" />
        <h2
          id={`post-${post.slug}-title`}
          className="text-foreground mb-1 text-lg leading-snug font-semibold"
        >
          {post.title}
        </h2>
        <p className="text-muted mb-3 line-clamp-2 text-sm">{post.excerpt}</p>
        <PostMeta date={post.date} readTime={post.readTime} className="text-xs" />
        {post.draft && (
          <p className="text-orange mt-2 text-xs font-medium">Draft — hidden in production</p>
        )}
      </div>
    </Card>
  );
}
