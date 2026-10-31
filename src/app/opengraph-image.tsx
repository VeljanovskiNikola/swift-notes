import { siteConfig } from "@/config/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: siteConfig.name, subtitle: siteConfig.tagline });
}
