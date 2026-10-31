import type { ComponentPropsWithoutRef } from "react";

/** Styled blockquote. Used for `>` lines in posts and can be used directly in MDX. */
export function Quote({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="border-primary bg-primary/8 text-foreground my-7 rounded-r-lg border-l-3 px-5 py-3 italic [&>p]:m-0"
      {...props}
    >
      {children}
    </blockquote>
  );
}
