import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  /** "content" for grids (1100px), "prose" for reading pages (680px). */
  size?: "content" | "prose";
  className?: string;
}

export function Container({ children, size = "content", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4",
        size === "prose" ? "max-w-prose" : "max-w-content",
        className,
      )}
    >
      {children}
    </div>
  );
}
