import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import type { ShikiTransformer } from "shiki";
import { CodeBlock } from "@/components/CodeBlock";
import { Quote } from "@/components/Quote";

/** Internal links use Next's <Link>; external links open in a new tab. */
function SmartLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/**
 * Components available in every post. Markdown elements map to these,
 * and you can also use them by name inside .mdx files, e.g. <Quote>.
 */
export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  blockquote: Quote,
  a: SmartLink,
  Quote,
};

/** Pass the code block's language to <CodeBlock> for its label. */
const languageAttribute: ShikiTransformer = {
  pre(node) {
    node.properties["data-language"] = this.options.lang;
  },
};

/** Compile a post body to React at build time (no MDX runtime in the browser). */
export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              theme: "one-dark-pro",
              defaultLanguage: "swift",
              fallbackLanguage: "text",
              transformers: [languageAttribute],
            },
          ],
        ],
      },
    },
  });
  return content;
}
