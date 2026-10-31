/**
 * Tag colors. To add a tag, add one line here: name and hex color.
 *
 * The order here is the order of the filter chips on the home page.
 * Tags used in posts but missing here still work: they get the
 * default color and appear after these, sorted by name.
 */
export const tagColors: Record<string, string> = {
  Concurrency: "#BF5AF2",
  Swift: "#BF5AF2",
  SwiftUI: "#0A84FF",
  Architecture: "#FF9F0A",
  Career: "#30D158",
};

/** Used for any tag not listed above (also used by project tags). */
export const defaultTagColor = "#4DA3FF";

export interface TagStyle {
  color: string;
  background: string;
}

/**
 * Text and background colors for a tag pill. The text is mixed with a
 * little white so small pill text always passes WCAG AA contrast.
 */
export function getTagStyle(tag: string): TagStyle {
  const known = tagColors[tag];
  if (known) return { color: mixWithWhite(known, 0.2), background: hexToRgba(known, 0.2) };
  return { color: mixWithWhite(defaultTagColor, 0.2), background: hexToRgba("#0A81FF", 0.15) };
}

/** The raw color for a tag (known color or the default). */
export function getTagColor(tag: string): string {
  return tagColors[tag] ?? defaultTagColor;
}

/** Sort tags: configured tags first in config order, then the rest A–Z. */
export function sortTags(tags: Iterable<string>): string[] {
  const order = Object.keys(tagColors);
  return [...new Set(tags)].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Blend a hex color toward white. amount 0 = unchanged, 1 = white. */
export function mixWithWhite(hex: string, amount: number): string {
  const channels = parseHex(hex).map((c) => Math.round(c + (255 - c) * amount));
  return `#${channels
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
