/**
 * Site-wide settings. Change these in one place and every page,
 * meta tag, sitemap entry and RSS item picks them up.
 */
export const siteConfig = {
  name: "Swift Notes",
  title: "Swift Notes — iOS Development Blog",
  tagline: "Thoughts on iOS development, Swift, and the craft of building software.",
  description: "Thoughts on iOS development, SwiftUI, Swift concurrency, and app architecture.",
  url: "https://www.nikolaveljanovski.com",
  locale: "en_US",
  author: {
    name: "Nikola Veljanovski",
    initials: "SN",
  },
  /**
   * true = every URL shows only the "Coming soon" screen (no nav, footer or content, and
   * search engines are told not to index it). Set to false to launch the real site.
   */
  comingSoon: true,
  nav: [
    { label: "Blog", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
  ],
  social: {
    github: "https://github.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/",
  },
  newsletter: {
    /**
     * Set your Buttondown username to collect real signups.
     * Leave empty to keep the form in demo mode (it shows a success
     * message but stores nothing). See src/lib/newsletter.ts.
     */
    buttondownUsername: "veljanovski",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Build an absolute URL for a site path, e.g. absoluteUrl("/about"). */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
