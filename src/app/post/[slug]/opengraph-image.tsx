import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const dynamicParams = false;
export const alt = "Swift Notes post";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgImage({ title: post?.title ?? "Swift Notes", tags: post?.tags });
}
