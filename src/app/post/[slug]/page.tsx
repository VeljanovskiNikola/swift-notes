import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PostMeta } from "@/components/PostMeta";
import { TagList } from "@/components/TagPill";
import { renderMdx } from "@/lib/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { blogPostingJsonLd, pageMetadata } from "@/lib/seo";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Only the posts that exist at build time get a page. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/post/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMdx(post.content);

  return (
    <Container size="prose">
      <JsonLd data={blogPostingJsonLd(post)} />
      <article>
        <BackLink />
        <TagList tags={post.tags} className="mb-4" />
        <h1 className="mb-3 text-3xl leading-tight font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <PostMeta date={post.date} readTime={post.readTime} className="mb-10 text-sm" />
        <div className="prose-swift">{content}</div>
      </article>
    </Container>
  );
}
