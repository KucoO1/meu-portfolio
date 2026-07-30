"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Layers, Server, ListChecks, Lightbulb, AlertTriangle, GraduationCap, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectData } from "../data/projects";
import QrCodePayDemo from "./demos/QrCodePayDemo";
import CrfDeskDemo from "./demos/CrfDeskDemo";

const DEMO_COMPONENTS: Record<string, React.ComponentType> = {
  qrcodepay: QrCodePayDemo,
  crfdesk: CrfDeskDemo,
};

export default function ProjectDetail({ project }: { project: ProjectData }) {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6 },
  };

  const DemoComponent = DEMO_COMPONENTS[project.slug];
  const isInternalLink = project.link.startsWith("/");
  const primaryLabel = DemoComponent ? "Ver demo interativa" : "Ver projeto ao vivo";

  return (
    <main className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ambient background gradient, consistent with the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-transparent to-amber-300/8 z-0 pointer-events-none" />

      {/* top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-sm bg-gray-950/90 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/#projetos"
            className="flex items-center gap-2 text-sm sm:text-base hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar aos projetos
          </Link>
          <span className="text-yellow-400 font-bold text-sm sm:text-base">Nataniel Oliveira</span>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-5xl">
        {/* Hero */}
        <motion.div {...fadeUp}>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs sm:text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight">{project.title}</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mb-6">{project.tagline}</p>

          <div className="flex flex-wrap gap-4">
            {isInternalLink ? (
              <Link
                href={project.link}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 font-semibold hover:opacity-90 transition-opacity"
              >
                {DemoComponent ? <PlayCircle size={18} /> : <ExternalLink size={18} />}
                {primaryLabel}
              </Link>
            ) : (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 font-semibold hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={18} />
                {primaryLabel}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors font-semibold"
              >
                <Github size={18} />
                Ver código-fonte
              </a>
            )}
          </div>
        </motion.div>

        {/* Cover image */}
        <motion.div
          {...fadeUp}
          className="relative w-full h-56 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden mt-10 mb-14 border border-gray-800"
        >
          <Image
            src={project.gallery[0] ?? project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
        </motion.div>

        {/* Demo interativa (simulação client-side, para projetos sem backend publicado) */}
        {DemoComponent && (
          <Section icon={<PlayCircle size={22} />} title="Demo interativa" id="demo" {...fadeUp}>
            <DemoComponent />
          </Section>
        )}

        {/* Visão geral */}
        <Section icon={<Layers size={22} />} title="Visão geral" {...fadeUp}>
          <p className="text-gray-300 leading-relaxed">{project.overview}</p>
        </Section>

        {/* Problema */}
        <Section icon={<Lightbulb size={22} />} title="O problema / objetivo" {...fadeUp}>
          <p className="text-gray-300 leading-relaxed">{project.problem}</p>
        </Section>

        {/* Stack */}
        <Section icon={<Server size={22} />} title="Stack tecnológica" {...fadeUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.stack.map((group) => (
              <div
                key={group.label}
                className="p-5 rounded-xl bg-gray-900/60 border border-gray-800"
              >
                <h4 className="text-yellow-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                  {group.label}
                </h4>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-amber-500 mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Arquitetura */}
        <Section icon={<Layers size={22} />} title="Arquitetura & decisões técnicas" {...fadeUp}>
          <div className="space-y-6">
            {project.architecture.map((block) => (
              <div key={block.title}>
                <h4 className="font-semibold text-lg mb-2">{block.title}</h4>
                <p className="text-gray-300 leading-relaxed">{block.content}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Backend explicado */}
        {project.backend.length > 0 && (
          <Section icon={<Server size={22} />} title="Como o backend foi pensado" {...fadeUp}>
            {!project.hasLiveBackend && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-amber-200 text-sm leading-relaxed">
                  O backend deste projeto não está publicamente hospedado (por isso as tags de
                  tecnologia abaixo do título indicam a stack usada).
                  {DemoComponent
                    ? " Experimente a demo interativa no topo desta página para ver o fluxo principal a funcionar — a simulação corre inteiramente no browser. "
                    : " "}
                  A explicação abaixo descreve exatamente como o backend foi desenhado e implementado durante o desenvolvimento.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {project.backend.map((block) => (
                <div key={block.title}>
                  <h4 className="font-semibold text-lg mb-2">{block.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{block.content}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Funcionalidades */}
        <Section icon={<ListChecks size={22} />} title="Funcionalidades principais" {...fadeUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-gray-900/40 border border-gray-800"
              >
                <span className="text-yellow-400 font-bold mt-0.5">✓</span>
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Desafios */}
        {project.challenges.length > 0 && (
          <Section icon={<AlertTriangle size={22} />} title="Desafios & soluções" {...fadeUp}>
            <div className="space-y-6">
              {project.challenges.map((block) => (
                <div key={block.title} className="p-5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <h4 className="font-semibold text-base mb-2 text-yellow-400">{block.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm">{block.content}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Aprendizagens */}
        {project.learnings.length > 0 && (
          <Section icon={<GraduationCap size={22} />} title="Principais aprendizagens" {...fadeUp}>
            <ul className="space-y-2">
              {project.learnings.map((l) => (
                <li key={l} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Gallery */}
        {project.gallery.length > 1 && (
          <Section icon={<Layers size={22} />} title="Galeria" {...fadeUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((src, i) => (
                <div
                  key={src}
                  className="relative h-48 sm:h-56 rounded-xl overflow-hidden border border-gray-800"
                >
                  <Image
                    src={src}
                    alt={`${project.title} - captura ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CTA footer */}
        <motion.div
          {...fadeUp}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-amber-600/10 border border-yellow-400/20 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Quer ver o projeto por dentro?</h3>
          <p className="text-gray-300 mb-6">
            {DemoComponent
              ? "Explore a demo interativa acima ou o código-fonte completo no GitHub."
              : "Explore a demo ao vivo ou o código-fonte completo no GitHub."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isInternalLink ? (
              <Link
                href={project.link}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 font-semibold hover:opacity-90 transition-opacity"
              >
                {DemoComponent ? <PlayCircle size={18} /> : <ExternalLink size={18} />}
                {primaryLabel}
              </Link>
            ) : (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 font-semibold hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={18} />
                Ver projeto
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors font-semibold"
              >
                <Github size={18} />
                Código
              </a>
            )}
            <Link
              href="/#projetos"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors font-semibold"
            >
              <ArrowLeft size={18} />
              Outros projetos
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Section({
  icon,
  title,
  children,
  ...motionProps
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  return (
    <motion.section {...motionProps} className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-yellow-400">{icon}</span>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
