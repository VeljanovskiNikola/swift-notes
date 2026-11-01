"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/cn";

/** "Blog" is active on the home page and on every post. */
function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/post/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = siteConfig.nav.map((item) => {
    const active = isActive(item.href, pathname);
    return { ...item, active };
  });

  return (
    <>
      {/* Dims the page behind the open mobile menu. Tapping it closes the menu. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <nav aria-label="Main" className="glass fixed inset-x-0 top-0 z-50 border-b border-white/6">
        <div className="max-w-content mx-auto flex h-14 items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="gradient-text text-lg font-bold tracking-tight"
          >
            {siteConfig.name}
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    link.active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="text-foreground -mr-1 cursor-pointer p-1 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>

        {/* Always rendered so it can animate; inert keeps it out of tab order and screen readers while closed. */}
        <div
          id="mobile-menu"
          inert={!open}
          className={cn(
            "bg-background grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out md:hidden",
            open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="flex flex-col border-t border-white/6 px-4 pt-2 pb-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.active ? "page" : undefined}
                    className={cn(
                      "block py-2.5 text-[15px]",
                      link.active ? "text-foreground" : "text-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
