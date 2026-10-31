import { siteConfig } from "@/config/site";
import { Icon, type IconName } from "@/components/Icon";

const LINKS: { key: keyof typeof siteConfig.social; label: string; icon: IconName }[] = [
  { key: "github", label: "GitHub", icon: "github" },
  { key: "twitter", label: "Twitter", icon: "twitter" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
];

export function SocialLinks() {
  return (
    <ul className="flex items-center gap-4">
      {LINKS.map(({ key, label, icon }) => (
        <li key={key} className="flex">
          <a
            href={siteConfig.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted hover:text-foreground transition-colors"
          >
            <Icon name={icon} />
          </a>
        </li>
      ))}
      <li className="flex">
        <a
          href="/feed.xml"
          aria-label="RSS feed"
          className="text-muted hover:text-foreground transition-colors"
        >
          <Icon name="rss" />
        </a>
      </li>
    </ul>
  );
}
