import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  /** Position in a list; staggers the fade-up animation. */
  index?: number;
  /** Delay between cards in ms. */
  stagger?: number;
  className?: string;
  /** Id of the element that names the card (used for linked cards). */
  labelledBy?: string;
}

/** The gradient-bordered card used for posts, projects and topics. */
export function Card({
  children,
  href,
  index = 0,
  stagger = 100,
  className,
  labelledBy,
}: CardProps) {
  const classes = cn(
    "gradient-border card-hover block rounded-card opacity-0 animate-fade-up",
    className,
  );
  const style: CSSProperties = { animationDelay: `${index * stagger}ms` };

  if (href) {
    return (
      <Link href={href} className={classes} style={style} aria-labelledby={labelledBy}>
        {children}
      </Link>
    );
  }
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
