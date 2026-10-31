import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20">
      <div className="glow-line opacity-40" aria-hidden />
      <div className="mx-auto flex flex-col items-center gap-6 px-4 py-8 text-center">
        <NewsletterForm />
        <SocialLinks />
        <p className="text-muted text-sm">
          © {year} {siteConfig.author.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
