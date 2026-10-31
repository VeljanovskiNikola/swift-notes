import type { Project } from "@content/projects";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { TagList } from "@/components/TagPill";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Card index={index} className="p-5">
      <h2 className="text-foreground mb-2 text-lg font-semibold">{project.name}</h2>
      <p className="text-muted mb-4 text-sm">{project.description}</p>
      <TagList tags={project.tags} className="mb-4" />
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-soft inline-flex items-center gap-1.5 text-sm hover:underline"
      >
        <Icon name="externalLink" size={14} />
        {project.linkLabel ?? "View on GitHub"}
        <span className="sr-only"> ({project.name}, opens in a new tab)</span>
      </a>
    </Card>
  );
}
