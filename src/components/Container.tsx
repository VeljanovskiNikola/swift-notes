import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  /** "content" for grids (full width), "prose" for reading pages (also full width). */
  size?: "content" | "prose";
  className?: string;
}

export function Container({ children, size = "content", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-8 lg:px-12",
        size === "prose" ? "max-w-prose" : "max-w-content",
        className,
      )}
    >
      {children}
    </div>
  );
}
