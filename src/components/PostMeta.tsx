import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

interface PostMetaProps {
  date: string;
  readTime: number;
  className?: string;
}

export function PostMeta({ date, readTime, className }: PostMetaProps) {
  return (
    <div className={cn("text-muted flex items-center gap-3", className)}>
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden>·</span>
      <span>{readTime} min read</span>
    </div>
  );
}
