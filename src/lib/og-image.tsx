import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getTagColor } from "@/config/tags";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface OgImageInput {
  title: string;
  subtitle?: string;
  tags?: string[];
}

/** The share image used by the home page and every post. */
export function renderOgImage({ title, subtitle, tags = [] }: OgImageInput) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0e0e11",
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(191,90,242,0.25), transparent 45%), radial-gradient(circle at 100% 100%, rgba(10,132,255,0.22), transparent 45%)",
        color: "#f5f5f5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#a78bfa" }}>
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 14 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 26,
                  padding: "6px 20px",
                  borderRadius: 999,
                  color: getTagColor(tag),
                  border: `2px solid ${getTagColor(tag)}`,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", lineHeight: 1.4 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#878792" }}>
        {new URL(siteConfig.url).host}
      </div>
    </div>,
    ogSize,
  );
}
