import { getPostSummaries } from "@/lib/posts";
import { buildRssFeed } from "@/lib/rss";

// Rendered once at build time into /out/feed.xml.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildRssFeed(getPostSummaries()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
