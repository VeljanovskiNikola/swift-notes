import type { Metadata } from "next";
import { projects } from "@content/projects";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { pageMetadata } from "@/lib/seo";

const description = "Side projects and open-source work.";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container>
      <PageHeader title="Projects" description={description} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </Container>
  );
}
