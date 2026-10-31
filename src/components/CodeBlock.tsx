"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/Icon";

const LANGUAGE_LABELS: Record<string, string> = {
  swift: "Swift",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  objc: "Objective-C",
  "objective-c": "Objective-C",
  yaml: "YAML",
  md: "Markdown",
  mdx: "MDX",
  text: "Text",
};

export function languageLabel(lang?: string): string {
  if (!lang) return "Code";
  return LANGUAGE_LABELS[lang.toLowerCase()] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

type PreProps = ComponentPropsWithoutRef<"pre"> & { "data-language"?: string };

/**
 * Wraps a Shiki-highlighted <pre>. Highlighting happens at build time;
 * this component only adds the language label and the Copy button.
 */
export function CodeBlock({ children, className, style, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = props["data-language"];

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border-border bg-code my-6 overflow-hidden rounded-xl border">
      <div className="border-border text-muted flex items-center justify-between border-b py-2 pr-3 pl-4 text-xs font-medium">
        <span className="flex items-center gap-2">
          <span className="bg-orange size-2 rounded-full" aria-hidden />
          {languageLabel(lang)}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
          className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 transition-colors ${
            copied
              ? "border-green text-green"
              : "border-border text-muted hover:text-foreground hover:border-[#3a3a42]"
          }`}
        >
          <Icon name={copied ? "check" : "copy"} size={12} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        ref={preRef}
        className={`overflow-x-auto p-4 font-mono text-[13.5px] leading-[1.65] [tab-size:4] [font-variant-ligatures:none] ${className ?? ""}`}
        style={style}
        tabIndex={0}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
