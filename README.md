# Swift Notes

Personal iOS blog by Nikola Veljanovski — [nikolaveljanovski.com](https://www.nikolaveljanovski.com).

Built with Next.js (App Router, static export), TypeScript, Tailwind CSS v4 and MDX.
Every page is plain HTML at build time. Code is highlighted at build time with Shiki,
so posts ship no highlighting JavaScript.

## Run it

Needs Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000 (drafts are visible here)
npm run build      # static site in /out
npm start          # serve /out locally
```

Checks:

```bash
npm run check      # typecheck + lint + unit tests + build
npm run test       # unit tests (Vitest)
npm run test:e2e   # build, then end-to-end tests (Playwright)
npm run format     # Prettier
```

The first time you run end-to-end tests, install a browser: `npx playwright install chromium`.

## Add a blog post

Create **one file** in `content/posts/`. The file name becomes the URL.

`content/posts/swift-testing-basics.mdx` → `/post/swift-testing-basics`

````mdx
---
title: "Swift Testing Basics"
excerpt: "A short summary shown on the home page and in search results."
date: 2026-11-02
tags: [Swift, Testing]
---

## First heading

Normal **Markdown** works. Inline `code` too.

```swift
@Test func addition() {
    #expect(1 + 1 == 2)
}
```

> Quotes become styled callouts.
````

That's it. The post appears on the home page, in search, under its tags, in
`sitemap.xml`, in `feed.xml`, and gets its own share image.

Frontmatter fields:

| Field      | Required | Notes                                                      |
| ---------- | -------- | ---------------------------------------------------------- |
| `title`    | yes      |                                                            |
| `excerpt`  | yes      | Shown on cards, in meta description and RSS.               |
| `date`     | yes      | `YYYY-MM-DD`. Posts are sorted newest first.               |
| `tags`     | yes      | At least one. New tags work right away.                    |
| `draft`    | no       | `true` shows the post in `npm run dev` only.               |
| `readTime` | no       | Minutes. Leave it out and it's calculated (200 words/min). |

File names must be lowercase letters, numbers and dashes. If a post has a
mistake, the build stops and tells you the file and the field.

Code blocks without a language are treated as Swift. Other languages work too:
` ```ts `, ` ```bash `, ` ```json `, and so on.

## Add or change a tag color

Edit `src/config/tags.ts` — one line per tag:

```ts
export const tagColors: Record<string, string> = {
  Concurrency: "#BF5AF2",
  // ...
  Testing: "#FF375F", // ← new
};
```

The order of this list is the order of the filter chips. A tag that isn't in the
list still works; it gets the default blue and appears after the listed ones.

## Add a project

Add one object to `content/projects.ts`:

```ts
{
  name: "Lumen",
  description: "What it is, in one or two sentences.",
  tags: ["SwiftUI", "Open Source"],
  url: "https://github.com/you/lumen",
},
```

## Other things you'll want to edit

| What                                | Where                   |
| ----------------------------------- | ----------------------- |
| Site name, URL, author, nav, social | `src/config/site.ts`    |
| About page text and topics          | `content/about.ts`      |
| Colors, fonts, radius, animations   | `src/app/globals.css`   |
| Newsletter provider                 | `src/lib/newsletter.ts` |

### Newsletter

The form works in demo mode until you connect a provider. For
[Buttondown](https://buttondown.com), set `newsletter.buttondownUsername` in
`src/config/site.ts`. For any other provider, change the body of `subscribe()` in
`src/lib/newsletter.ts`; the form and messages stay the same.

## Deploy

**Vercel (recommended):** push the repo to GitHub, then import it at
[vercel.com/new](https://vercel.com/new). Vercel detects Next.js; no settings needed.
Add your domain under Project → Settings → Domains.

**Any static host:** run `npm run build` and upload the `out/` folder
(Netlify, Cloudflare Pages, GitHub Pages, S3...).

`vercel.json` sets content types for share images and the RSS feed, and long
cache headers for hashed assets.

## Project layout

```
content/
  posts/*.mdx          ← blog posts (one file each)
  projects.ts          ← Projects page data
  about.ts             ← About page text
src/
  app/                 ← routes: home, post/[slug], about, projects, 404,
                         sitemap.xml, robots.txt, feed.xml, share images
  components/          ← small UI pieces (Nav, Footer, PostCard, CodeBlock...)
  config/              ← site.ts and tags.ts
  lib/                 ← content loading, MDX, SEO, RSS, read time, newsletter
tests/
  unit/                ← Vitest
  e2e/                 ← Playwright
```
