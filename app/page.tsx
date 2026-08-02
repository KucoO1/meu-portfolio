"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./i18n/LanguageContext";
import Header from "./components/Header";
import FloatingElements from "./components/FloatingElements";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import Footer from "./components/Footer";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

interface ProjectBase {
  slug: string;
  technologies: string[];
  image: string;
  link: string;
  github: string;
  featured?: boolean;
}

interface FloatingElement {
  id: number;
  size: number;
  color: string;
  top: string;
  left: string;
  duration: number;
  direction: number;
  delay: number;
  borderRadius: string;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  
  const { t } = useLanguage();
  const texts = t.hero.roles;

  const projectsBase: ProjectBase[] = [
     {
      slug: "boardgov-ao",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "Docker"],
      image: "/images/boardgov.jpg",
      link: "/projetos/boardgov-ao#demo",
      github: "",
      featured: true
    },
    {
      slug: "crfdesk",
      technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
      image: "/images/projetos/crfdesk/crfdesk-2.png",
      link: "/projetos/crfdesk#demo",
      github: "",
      featured: true
    },
     {
      slug: "argpack",
      technologies: ["Next.js","Node.js","Firebase"],
      image: "/images/argpack.jpg",
      link: "https://argpack-frontend.vercel.app/",
      github: "https://github.com/KucoO1/argpack-frontend",
      featured: true
    },
    {
      slug: "qrcodepay",
      technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
      image: "/images/projetos/qrcodepay/qrcodepay-1.png",
      link: "/projetos/qrcodepay#demo",
      github: ""
    },
    {
      slug: "ecommerce",
      technologies: ["Next.js", "Node.js", "MongoDB"],
      image: "/images/ecommerce.jpg",
      link: "https://ecommerce-five-lime-36.vercel.app/",
      github: "https://github.com/KucoO1/ecommerce"
    },
    {
      slug: "barbearia",
      technologies: ["Typescript", "Next.js"],
      image: "/images/barbearia.jpg",
      link: "https://barbearia-sepia-eight.vercel.app/",
      github: "https://github.com/KucoO1/barbearia",
      featured: true
    },
    {
      slug: "gestao-financeira",
      technologies: ["React", "Node.js+express"],
      image: "/images/gestao-financeira.jpg",
      link: "https://financas-pessoais-frontend.vercel.app/",
      github: "https://github.com/KucoO1/financas-pessoais-frontend"
    },
    {
      slug: "orbital",
      technologies: ["Next.js", "Node.js", "MongoDB"],
      image: "/images/orbita.jpg",
      link: "https://orbita-mocha-nine.vercel.app/",
      github: "https://github.com/KucoO1/orbita"
    },
    {
      slug: "neoxia",
      technologies: ["Typescript", "Next.js"],
      image: "/images/Neoxia.jpg",
      link: "https://neoxia.vercel.app/",
      github: "https://github.com/KucoO1/Neoxia"
    },
    {
      slug: "gestao-stock",
      technologies: ["Node.js + express", "Next.js", "MySQL"],
      image: "/images/gestao-stock.jpg",
      link: "https://gestao-frontend-zeta.vercel.app/",
      github: "https://github.com/KucoO1/gestao-de-stock"
    },
    {
      slug: "landing-page",
      technologies: ["React"],
      image: "/images/landin-page.jpg",
      link: "https://landing-page-hotmart-nine.vercel.app/",
      github: "https://github.com/KucoO1/landing-page-hotmart"
    },
    
    {
      slug: "games-hub",
      technologies: ["React","Typescript"],
      image: "/images/gameshub.jpg",
      link: "https://jogo-memoria-e-mais.vercel.app/",
      github: "https://github.com/KucoO1/jogo-memoria-e-mais"
    },
    {
      slug: "primeflix",
      technologies: ["React","axios"],
      image: "/images/primeFlix.jpg",
      link: "https://primeflix-one-chi.vercel.app/",
      github: "https://github.com/KucoO1/primeFlix"
    }
   
  ];

  const projects = projectsBase.map((p) => ({
    ...p,
    title: t.projects[p.slug]?.title ?? p.slug,
    description: t.projects[p.slug]?.description ?? "",
  }));

  // Verificar se é mobile e inicializar elementos flutuantes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    };
    
    if (typeof window !== 'undefined') {
      const elements = Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        size: window.innerWidth < 768 ? 20 + Math.random() * 50 : 35 + Math.random() * 90,
        color: 
          i % 4 === 0 ? "yellow-light" : 
          i % 4 === 1 ? "yellow-medium" : 
          i % 4 === 2 ? "blue" : "yellow-dark",
        top: Math.random() * 90 + "%",
        left: Math.random() * 90 + "%",
        duration: 4 + Math.random() * 15,
        direction: Math.random() > 0.5 ? 1 : -1,
        delay: Math.random() * 2,
        borderRadius: Math.random() > 0.7 ? "50%" : "30%",
      }));
      setFloatingElements(elements);
      
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkIsMobile);
      }
    };
  }, []);
  
  // Efeito de digitação
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <main className={`relative min-h-screen overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <FloatingElements elements={floatingElements} darkMode={darkMode} />

      <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-yellow-400/8 via-transparent to-amber-300/8' : 'from-yellow-200/20 via-transparent to-amber-100/20'} z-0`} />

      <HeroSection darkMode={darkMode} textIndex={textIndex} />
      
      <ProjectsSection darkMode={darkMode} projects={projects} />
      
      <SkillsSection darkMode={darkMode} />

      <AboutSection darkMode={darkMode} />
      
      
      <ContactSection darkMode={darkMode} /> 
      
      <Footer darkMode={darkMode} />
    </main>
  );
}