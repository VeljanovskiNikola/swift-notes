import Link from "next/link";
import { Icon } from "@/components/Icon";

export function BackLink({
  href = "/",
  label = "Back to blog",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-primary mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
    >
      <Icon name="arrowLeft" size={14} />
      {label}
    </Link>
  );
}
