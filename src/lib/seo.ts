import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { Post } from "@/lib/posts";

interface PageMetaInput {
  title?: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

/** One helper for every page's title, description, canonical, OG and Twitter tags. */
export function pageMetadata({
  title,
  description = siteConfig.description,
  path,
  type = "website",
  publishedTime,
  tags,
}: PageMetaInput): Metadata {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  return {
    title: title ?? { absolute: siteConfig.title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(type === "article" && {
        publishedTime,
        authors: [siteConfig.author.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function blogPostingJsonLd(post: Post) {
  const url = absoluteUrl(`/post/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: absoluteUrl(`/post/${post.slug}/opengraph-image`),
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readTime}M`,
    author: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.url },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.url },
  };
}
