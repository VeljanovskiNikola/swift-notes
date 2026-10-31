import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** "lg" for the home page title, "md" for inner pages. */
  size?: "lg" | "md";
}

export function PageHeader({ title, description, size = "md" }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1
        className={cn(
          "gradient-text mb-2 w-fit tracking-tight",
          size === "lg" ? "text-4xl font-extrabold" : "text-3xl font-bold",
        )}
      >
        {title}
      </h1>
      {description && <p className="text-muted">{description}</p>}
    </header>
  );
}
