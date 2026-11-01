import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";

/** Full-screen placeholder shown for every URL while `siteConfig.comingSoon` is true. */
export function ComingSoon() {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4 text-center">
      <div className="animate-fade-up max-w-reading">
        <span className="bg-card text-primary mx-auto mb-6 flex size-14 items-center justify-center rounded-full">
          <Icon name="zap" size={24} aria-hidden="true" />
        </span>
        <p className="text-muted mb-3 text-sm font-medium tracking-widest uppercase">Coming soon</p>
        <h1 className="gradient-text mx-auto mb-4 w-fit text-4xl font-extrabold tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="text-muted">{siteConfig.tagline} New posts are on the way.</p>
      </div>
    </main>
  );
}
