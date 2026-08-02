"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, FileText, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../i18n/LanguageContext";

interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  github: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  darkMode: boolean;
  projects: Project[];
}

export default function ProjectsSection({ darkMode, projects }: ProjectsSectionProps) {
  const { t } = useLanguage();
  return (
    <section id="projetos" className="py-16 md:py-24 px-4 sm:px-6 text-center relative z-10">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-400"
        >
          {t.projectsSection.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-8 sm:mb-12 max-w-2xl mx-auto text-lg"
        >
          {t.projectsSection.subtitle}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  darkMode,
}: {
  project: Project;
  index: number;
  darkMode: boolean;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10 }}
      className={`p-1 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 group cursor-pointer ${
        darkMode ? "" : "shadow-lg"
      } ${project.featured ? "shadow-[0_0_30px_-6px_rgba(251,191,36,0.55)]" : ""}`}
    >
      <div
        className={`p-4 sm:p-6 rounded-2xl h-full ${
          darkMode ? "bg-gray-900" : "bg-white"
        } transition-all duration-300`}
      >
        <Link href={`/projetos/${project.slug}`} className="block relative h-40 sm:h-48 mb-4 overflow-hidden rounded-xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              darkMode
                ? "from-yellow-400/20 to-amber-600/20"
                : "from-yellow-200/30 to-amber-300/30"
            } z-0`}
          ></div>
          {project.featured && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-lg">
              <Star size={11} className="fill-gray-950" />
              {t.projectsSection.featured}
            </div>
          )}
          <div className="absolute bottom-4 left-0 right-0 z-20 text-center px-4">
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          </div>
        </Link>

        <p className="mb-4 text-left text-sm sm:text-base">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs sm:text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-3 text-xs sm:text-sm mb-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 hover:text-yellow-400 transition-colors"
          >
            <ExternalLink size={14} />
            {t.projectsSection.viewProject}
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 hover:text-yellow-400 transition-colors"
            >
              <Github size={14} />
              {t.projectsSection.code}
            </a>
          )}
        </div>

        <Link
          href={`/projetos/${project.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs sm:text-sm font-medium hover:bg-yellow-400/20 transition-colors"
        >
          <FileText size={14} />
          {t.projectsSection.technicalDetails}
        </Link>
      </div>
    </motion.div>
  );
}