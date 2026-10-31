import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.draft);
  const latest = posts[0]?.date;

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/post/${post.slug}`),
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
