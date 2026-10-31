import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { PostExplorer } from "@/components/PostExplorer";
import { getAllTags, getPostSummaries } from "@/lib/posts";
import { pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  const posts = getPostSummaries();
  const tags = getAllTags(posts);

  return (
    <Container>
      <JsonLd data={websiteJsonLd()} />
      <PageHeader title={siteConfig.name} description={siteConfig.tagline} size="lg" />
      <PostExplorer posts={posts} tags={tags} />
    </Container>
  );
}
