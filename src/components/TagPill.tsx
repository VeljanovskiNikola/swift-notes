import { getTagStyle } from "@/config/tags";

export function TagPill({ tag }: { tag: string }) {
  const { color, background } = getTagStyle(tag);
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: background }}
    >
      {tag}
    </span>
  );
}

export function TagList({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="flex">
          <TagPill tag={tag} />
        </li>
      ))}
    </ul>
  );
}
