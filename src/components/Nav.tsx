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
    <nav
      aria-label="Main"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/6",
        open ? "bg-background" : "glass",
      )}
    >
      <div className="max-w-content mx-auto flex h-14 items-center justify-between px-4">
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

      {open && (
        <ul
          id="mobile-menu"
          className="bg-background flex flex-col border-t border-white/6 px-4 pt-2 pb-4 md:hidden"
        >
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
      )}
    </nav>
  );
}
