# Swift Notes — Engineering Instructions

Rules and context for anyone changing this codebase: you, a teammate, or an AI coding assistant.
Read this before you write code. If a change breaks a rule here, update this file in the same commit
and say why.

---

## 1. What this project is

Swift Notes is the personal iOS development blog of Nikola Veljanovski, at
https://www.nikolaveljanovski.com.

It is a **fully static site**. `next build` writes plain HTML, CSS and JS to `out/`. There is no server,
no database and no API at runtime.

**The main goal:** adding a post is **one new `.mdx` file and nothing else**. Every change must keep
that true.

**Quality bar. Do not merge if any of these drop:**

- Lighthouse 95+ on all four scores, mobile and desktop, every page. Current: 99–100.
- Cumulative Layout Shift is 0.
- WCAG 2.1 AA, including colour contrast.
- `npm run check` and `npm run test:e2e` pass.

---

## 2. Stack

| Area      | Tool                                        | Version   |
| --------- | ------------------------------------------- | --------- |
| Framework | Next.js, App Router, `output: "export"`     | 16.4      |
| UI        | React                                       | 19.3      |
| Language  | TypeScript, strict                          | 6.0       |
| Styling   | Tailwind CSS (CSS-first config)             | 4.3       |
| Content   | MDX via `next-mdx-remote/rsc` + gray-matter | 6.0       |
| Code      | Shiki via `@shikijs/rehype`, at build time  | 4.5       |
| Schemas   | Zod                                         | 4.6       |
| Tests     | Vitest (unit), Playwright (e2e)             | 5.0, 1.64 |
| Lint      | ESLint flat config + `eslint-config-next`   | 9.39      |
| Format    | Prettier + `prettier-plugin-tailwindcss`    | 3.9       |
| Fonts     | Inter, JetBrains Mono, self-hosted          | —         |
| Hosting   | Vercel (any static host works)              | —         |

Node 22 (`.nvmrc`).

**Version notes:**

- **Next.js 16** differs from older tutorials. Before using a Next.js API, check the docs that ship
  with the package in `node_modules/next/dist/docs/`. `next lint` is gone; use `npm run lint`.
- **Tailwind 4** has no `tailwind.config.js`. Tokens live in `@theme` in `src/app/globals.css`.
- **Zod 4** uses `{ error: "..." }` for custom messages, not `{ message }` or `required_error`.

---

## 3. Commands

```bash
npm run dev           # dev server, http://localhost:3000. Shows drafts.
npm run build         # static build to out/. Hides drafts.
npm start             # serve out/ locally
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # what CI runs
npm test              # Vitest unit tests
npm run test:e2e      # build, then Playwright (desktop + mobile)
npm run check         # typecheck + lint + unit tests + build
```

First e2e run on a new machine: `npx playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs format check, typecheck, lint, unit tests and e2e on every
push to `main` and every PR.

---

## 4. Folder map

```
content/                      ← EDITORIAL. Writers work here.
  posts/*.mdx                 one file = one post. File name = URL slug.
  projects.ts                 Projects page entries
  about.ts                    About page text and topic cards
src/
  config/
    site.ts                   name, URL, author, nav, social links, newsletter
    tags.ts                   tag → colour map, pill styling, tag sort order
  app/                        routes only. Thin: load data, render components.
    layout.tsx                fonts, global metadata, Nav, Footer, Toaster, skip link
    page.tsx                  home
    post/[slug]/page.tsx      post page (SSG via generateStaticParams)
    post/[slug]/opengraph-image.tsx
    about/page.tsx, projects/page.tsx, not-found.tsx
    sitemap.ts, robots.ts, feed.xml/route.ts, opengraph-image.tsx, icon.svg
    globals.css               design tokens + shared utilities + prose styles
  components/                 small presentational pieces, one per file
  lib/                        logic, no JSX except mdx.tsx and og-image.tsx
    posts.ts                  load + validate posts (Zod), slugs, drafts, tags
    read-time.ts              word count and minutes
    mdx.tsx                   MDX compile, Shiki config, MDX component map
    seo.ts                    pageMetadata(), JSON-LD builders
    rss.ts, filter-posts.ts, format.ts, newsletter.ts, toast.ts, cn.ts, og-image.tsx
tests/
  unit/*.test.ts              Vitest
  e2e/*.spec.ts               Playwright, runs against the built out/
```

**Path aliases:** `@/*` → `src/*` and `@content/*` → `content/*`. Use them. No `../../`.

**Where things belong:**

| You want to change…               | Edit                       |
| --------------------------------- | -------------------------- |
| A post                            | `content/posts/<slug>.mdx` |
| A tag colour or chip order        | `src/config/tags.ts`       |
| Site name, URL, socials, nav      | `src/config/site.ts`       |
| Colours, fonts, radius, animation | `@theme` in `globals.css`  |
| How posts are read or validated   | `src/lib/posts.ts`         |
| How Markdown renders              | `src/lib/mdx.tsx`          |
| Titles, OG tags, JSON-LD          | `src/lib/seo.ts`           |
| Newsletter provider               | `src/lib/newsletter.ts`    |

---

## 5. Hard rules

These are not style choices. Breaking them breaks the build, the site or the main goal.

### 5.1 Static export only

`next.config.ts` sets `output: "export"`. So you **cannot** use:

- Server Actions, cookies, headers, `redirects`, `rewrites`, middleware or proxy, ISR, Draft Mode
- Route handlers that read the `Request`
- `next/image` with the default loader (images are `unoptimized`)
- Dynamic routes without `generateStaticParams()`

You **must**:

- Add `export const dynamic = "force-static"` to every route handler and metadata route
  (`feed.xml`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`).
- Add `export const dynamicParams = false` to every dynamic segment, so unknown slugs give a 404.

If a feature needs a server (comments, view counts, a real newsletter endpoint), use a third-party
service called from the browser. Never turn off static export to get it.

### 5.2 Adding a post is one file

- Post data comes **only** from `getAllPosts()` / `getPostSummaries()` in `src/lib/posts.ts`.
- **Never** hard-code a post, slug, tag or count in a component, page, test or config. The home page,
  tag chips, sitemap, RSS, OG images and static params all read from that one loader.
- Tags come from posts. `src/config/tags.ts` only adds colour and order. An unknown tag must still
  work with the default colour.
- Read time is calculated. The optional `readTime` frontmatter field is only an override.

### 5.3 Bad content fails the build

- `frontmatterSchema` in `posts.ts` is the contract for a post. Any new frontmatter field gets added
  there with a type, a default or `.optional()`, and a plain error message.
- Error messages must name the file and the field and say how to fix it, e.g.
  `"broken.mdx" has invalid frontmatter: - date: date must look like 2026-03-27`.
- Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Don't loosen this; it protects URLs.

### 5.4 Server first, client only when needed

- Components are Server Components by default.
- Add `"use client"` **only** when a component needs state, effects, event handlers or browser APIs.
  Current client components: `Nav`, `PostExplorer`, `SearchInput`, `TagFilter`, `CodeBlock`,
  `NewsletterForm`, `Toaster`. Keep this list short.
- Never pass a full `Post` (with `content`) to a client component. Use `toSummary()` / `PostSummary`
  so post bodies don't ship to the browser twice.
- MDX compiles and Shiki highlights **at build time**. Never add a client-side highlighter or an MDX
  runtime.

### 5.5 One source for design values

- Colours, fonts, radius, widths and animations are tokens in `@theme` in `globals.css`.
  Use the generated classes (`bg-card`, `text-muted`, `max-w-prose`, `animate-fade-up`…).
- No raw hex in components. Exceptions: `src/config/tags.ts` (tag data), `og-image.tsx`
  (image rendering can't read CSS), and the Subscribe button gradient (contrast-tuned).
- Repeated visual patterns are `@utility` classes in `globals.css`: `gradient-text`,
  `gradient-border`, `card-hover`, `glass`, `glow-line`, `prose-swift`, `line-clamp-2`.
  Add a new one there rather than repeating long class strings.
- Gradient text needs `w-fit` on block elements, or the gradient spreads across the full width and
  only one colour shows.

### 5.6 Fonts

- Fonts load with `next/font/local` from `@fontsource-variable/*` in `layout.tsx`. No Google Fonts
  `<link>`, no remote font requests. This keeps CLS at 0 and avoids third-party calls.
- Code blocks turn ligatures off (`font-variant-ligatures: none`). `->` must show as typed in Swift.

---

## 6. Code conventions

### TypeScript

- Strict mode, plus `noUncheckedIndexedAccess`. Handle `undefined` from array and record lookups.
  Don't silence it with `!` unless you've just checked it.
- No `any`. Use `unknown` and narrow it.
- Use `import type` for type-only imports.
- Export named functions and components. Default exports only where Next.js requires them (pages,
  layouts, metadata routes, `opengraph-image`).
- Types live next to the code that owns them (`PostSummary` in `posts.ts`, `Project` in
  `content/projects.ts`). No global `types.ts`.

### React and components

- One component per file in `src/components/`, PascalCase file name matching the export.
- Props are a typed interface or inline type. Give defaults in the parameter list.
- Keep components presentational. Data loading happens in `app/` pages; logic lives in `src/lib/`.
- Reuse before you add: `Container`, `Card`, `PageHeader`, `TagList`/`TagPill`, `PostMeta`,
  `BackLink`, `Icon`.
- Icons: add the Lucide SVG paths to `Icon.tsx`. Don't install an icon library.
- Use `cn()` from `@/lib/cn` to join conditional classes.
- Don't call `setState` directly inside `useEffect`; ESLint (`react-hooks/set-state-in-effect`)
  rejects it. Update state in the event handler instead, as `Nav` does when closing the menu.
- `key` must be stable data (slug, name, href). Never the array index.

### Styling

- Tailwind classes in JSX. Prettier sorts them; don't sort by hand.
- Mobile first. Breakpoints: `sm` 640px, `md` 768px. Test at 390px wide.
- Don't add CSS files. Global styles go in `globals.css` only.

### Naming

- Files: `PascalCase.tsx` for components, `kebab-case.ts` for lib, `kebab-case.mdx` for posts.
- Functions: verbs (`getAllPosts`, `buildRssFeed`, `renderMdx`). Booleans: `is`/`has`/`show`.
- Comments explain **why**, not what. New exported lib functions get a one-line JSDoc.

### Dependencies

- Ask before adding a runtime dependency. Every one costs bundle size, security updates and upgrade
  work. Prefer a 20-line helper in `src/lib/`.
- No UI kits (MUI, Chakra, shadcn), no CSS-in-JS, no state libraries, no date libraries.
- Dev dependencies for tooling are fine if they earn their place.

---

## 7. Accessibility

Every change must keep:

- **Contrast AA:** 4.5:1 for normal text, 3:1 for large text. Pill text uses `mixWithWhite(color, 0.2)`
  for this reason. Check new colours before using them.
- **Keyboard:** everything clickable is a `<button>` or `<a>`. Focus rings stay visible
  (`:focus-visible` in `globals.css`). Never `outline: none` without a replacement.
- **Names:** icon-only controls need `aria-label`. Linked cards use `aria-labelledby` pointing at
  their title (see `Card` + `PostCard`). Decorative icons are `aria-hidden`.
- **Structure:** one `<h1>` per page; headings don't skip levels; landmarks are `nav`, `main`,
  `footer`; the "Skip to content" link stays first in `<body>`.
- **State:** toggles use `aria-pressed`, menus use `aria-expanded` + `aria-controls`, the current nav
  link has `aria-current="page"`, live updates use `aria-live`.
- **Motion:** respect `prefers-reduced-motion` (handled globally in `globals.css`). Don't add
  animations that skip it.

---

## 8. SEO

- Every page exports `metadata` or `generateMetadata` built with `pageMetadata()` from
  `src/lib/seo.ts`. It sets title, description, canonical, Open Graph and Twitter in one call.
  Don't write those tags by hand.
- Titles follow `"<Page> — Swift Notes"`. The home page uses the full site title.
- Posts render `blogPostingJsonLd()`; the home page renders `websiteJsonLd()`. Use `<JsonLd>`.
- New public pages must be added to `src/app/sitemap.ts`.
- Absolute URLs come from `absoluteUrl()` in `site.ts`. Never hard-code the domain.
- `vercel.json` sets `Content-Type: image/png` for `opengraph-image` files, because static export
  writes them without an extension. Keep that rule if you change hosting.

---

## 9. Testing

**Unit (Vitest, `tests/unit/`)**

- Every function in `src/lib/` and `src/config/` that has logic gets tests.
- Test content loading against a temp folder (`fs.mkdtempSync`), not the real posts, except the one
  "every real post is valid" test.
- New frontmatter fields need a valid case, an invalid case and a default case.

**End-to-end (Playwright, `tests/e2e/`)**

- Runs against the real static build, on desktop and mobile (Pixel 7).
- Use role-based locators (`getByRole`, `getByLabel`). They also check accessibility. No CSS
  selectors unless there's no other way.
- Any new page, nav item or interactive feature gets an e2e test.
- On mobile, nav links are behind the menu button; use the `clickNav()` helper.

**Before every merge, run:**

```bash
npm run format:check && npm run check && npm run test:e2e
```

---

## 10. Common tasks

### Add a post

Create `content/posts/<slug>.mdx`:

````mdx
---
title: "Swift Testing Basics"
excerpt: "One or two sentences for cards, search, meta description and RSS."
date: 2026-11-02
tags: [Swift, Testing]
# draft: true       # optional: visible in dev only
# readTime: 6       # optional: overrides the calculated value
---

## First section

Markdown, `inline code`, **bold**, lists and > quotes all work.

```swift
@Test func addition() {
    #expect(1 + 1 == 2)
}
```
````

No other file changes. A fenced block with no language is treated as Swift.

### Add a tag colour

One line in `tagColors` in `src/config/tags.ts`. The order there is the chip order on the home page.
Check that the colour passes contrast as pill text on its 20% background.

### Add a project

One object in `content/projects.ts`. Unknown tags get the default colour.

### Add a component usable inside posts

1. Build it in `src/components/` as a Server Component if possible.
2. Register it in `mdxComponents` in `src/lib/mdx.tsx`.
3. Writers can now use `<MyComponent />` in any `.mdx` file without importing it.
4. Add an e2e or unit test that covers it.

### Add a page

1. `src/app/<route>/page.tsx` with `export const metadata = pageMetadata({...})`.
2. Wrap content in `<Container>`; use `<PageHeader>` for the title.
3. Add it to `siteConfig.nav` if it belongs in the menu.
4. Add it to `sitemap.ts`.
5. Add an e2e step for it.

### Connect the newsletter

Set `newsletter.buttondownUsername` in `site.ts`, or replace the body of `subscribe()` in
`src/lib/newsletter.ts` for another provider. The form, validation and toasts must not change.
Never put an API secret in client code; this site has no server to hide it.

### Upgrade dependencies

1. Upgrade one major package per PR.
2. Read its migration guide. For Next.js, also read `node_modules/next/dist/docs/` after installing.
3. Run the full checks and a Lighthouse pass.

---

## 11. Definition of done

A change is ready when all of these are true:

- [ ] Adding a post is still one file with no other edits.
- [ ] `npm run format:check`, `npm run check` and `npm run test:e2e` pass.
- [ ] New logic has unit tests; new pages and interactions have e2e tests.
- [ ] Looks right at 390px and 1280px wide.
- [ ] Works with keyboard only; focus is visible; contrast passes.
- [ ] Lighthouse stays 95+ on all scores; CLS stays 0.
- [ ] No new runtime dependency without a stated reason.
- [ ] No hard-coded posts, tags, domain or colours outside the allowed places.
- [ ] README and this file are updated if the workflow changed.

---

## 12. Don't

- Don't turn off `output: "export"` or add anything that needs a server.
- Don't hard-code post data anywhere.
- Don't send post bodies to client components.
- Don't add client-side syntax highlighting or an MDX runtime.
- Don't load fonts from Google or any CDN.
- Don't add a UI library, icon library or CSS-in-JS.
- Don't use raw hex colours in components.
- Don't loosen the frontmatter schema or slug rule to make a broken post build.
- Don't edit `out/`, `.next/` or `next-env.d.ts`; they are generated.
- Don't commit secrets. The site is public and fully client-side.

---

## 13. Git

- Branch from `main`: `feat/…`, `fix/…`, `post/…`, `chore/…`.
- Commit messages: short, plain, present tense. `Add Swift Testing post`, `Fix nav focus on mobile`.
- Content-only PRs (`post/…`) touch only `content/`.
- Keep PRs small and focused: one feature or fix each.
