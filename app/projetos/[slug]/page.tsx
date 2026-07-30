import { notFound } from "next/navigation";
import { getAllSlugs, getProjectBySlug } from "../../data/projects";
import ProjectDetail from "../../components/ProjectDetail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: `${project.title} - Nataniel Oliveira`,
    description: project.tagline,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
