import type { Metadata } from "next";
import { about } from "@content/about";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/Container";
import { TopicCard } from "@/components/TopicCard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: about.intro[0],
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container size="prose">
      <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row">
        <div
          className="gradient-bg flex size-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white"
          aria-hidden
        >
          {siteConfig.author.initials}
        </div>
        <div>
          <h1 className="gradient-text mb-3 w-fit text-3xl font-bold tracking-tight">About</h1>
          {about.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-muted mb-3 leading-relaxed last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <h2 className="mb-6 text-xl font-semibold">{about.topicsTitle}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {about.topics.map((topic, index) => (
          <TopicCard key={topic.title} {...topic} index={index} />
        ))}
      </div>
    </Container>
  );
}
