"use client";

import { Icon } from "@/components/Icon";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search posts...",
  label = "Search posts",
}: SearchInputProps) {
  return (
    <div className="relative mb-4">
      <Icon
        name="search"
        size={16}
        className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="border-border bg-card text-foreground placeholder:text-muted w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm transition-all focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  );
}
