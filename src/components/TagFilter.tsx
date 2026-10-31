"use client";

import { getTagColor } from "@/config/tags";

interface TagFilterProps {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
}

/** Tag chips. Click a chip to filter; click it again to clear. */
export function TagFilter({ tags, active, onChange }: TagFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
      {tags.map((tag) => {
        const color = getTagColor(tag);
        const isActive = active === tag;
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : tag)}
            className="cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all"
            style={
              isActive
                ? { backgroundColor: color, borderColor: color, color: "#0e0e11" }
                : { backgroundColor: "transparent", borderColor: color, color }
            }
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
