"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import FloatingElements from "./components/FloatingElements";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import Footer from "./components/Footer";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
  github: string;
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
  
  const texts = ["Programador", "Desenvolvedor Fullstack", "Criativo"];
  
  const projects: Project[] = [
     {
      slug: "qrcodepay",
      title: "QrCodePay",
      description: "Plataforma de pagamentos por QR Code para comerciantes, com onboarding por convite e painel administrativo completo. Backend não está publicado — inclui demo interativa.",
      technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
      image: "/images/projetos/qrcodepay/qrcodepay-1.png",
      link: "/projetos/qrcodepay#demo",
      github: ""
    },
    {
      slug: "crfdesk",
      title: "CRFDesk",
      description: "Plataforma de screening e compliance para ativos cripto, com scoring de risco explicável e relatórios prontos para reguladores. Backend não está publicado — inclui demo interativa.",
      technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
      image: "/images/projetos/crfdesk/crfdesk-2.png",
      link: "/projetos/crfdesk#demo",
      github: ""
    },
    {
      slug: "ecommerce",
      title: "E-commerce",
      description: "Plataforma completa de e-commerce com painel administrativo.",
      technologies: ["Next.js", "Node.js", "MongoDB"],
      image: "/images/ecommerce.jpg",
      link: "https://ecommerce-five-lime-36.vercel.app/",
      github: "https://github.com/KucoO1/ecommerce"
    },
    {
      slug: "orbital",
      title: "Projeto orbita",
      description: "Plataforma completa de e-commerce com painel administrativo e integração com pagamentos.",
      technologies: ["Next.js", "Node.js", "MongoDB"],
      image: "/images/orbita.jpg",
      link: "https://orbita-mocha-nine.vercel.app/",
      github: "https://github.com/KucoO1/orbita"
    },
    {
      slug: "gestao-financeira",
      title: "Sistema de Gestão Financeira",
      description: "Sistema para controle de finanças pessoais com relatórios",
      technologies: ["React", "Node.js+express"],
      image: "/images/gestao-financeira.jpg",
      link: "https://financas-pessoais-frontend.vercel.app/",
      github: "https://github.com/KucoO1/financas-pessoais-frontend"
    },
    {
      slug: "neoxia",
      title: "Neoxia",
      description: "Agencia de Marketing Digital, com o objetivo de fornecer soluções inovadoras e eficazes para empresas que desejam expandir sua presença online e alcançar seus objetivos de negócios.",
      technologies: ["Typescript", "Next.js"],
      image: "/images/Neoxia.jpg",
      link: "https://neoxia.vercel.app/",
      github: "https://github.com/KucoO1/Neoxia"
    },
    {
      slug: "gestao-stock",
      title: "Gestão de Stock",
      description: "Sistema para gestão de stock completo.",
      technologies: ["Node.js + express", "Next.js", "MySQL"],
      image: "/images/gestao-stock.jpg",
      link: "https://gestao-frontend-zeta.vercel.app/",
      github: "https://github.com/KucoO1/gestao-de-stock"
    },
    {
      slug: "landing-page",
      title: "Landing Page",
      description: "Página de conversão altamente persuasiva",
      technologies: ["React"],
      image: "/images/landin-page.jpg",
      link: "https://landing-page-hotmart-nine.vercel.app/",
      github: "https://github.com/KucoO1/landing-page-hotmart"
    },
    {
      slug: "argpack",
      title: "ArgPack",
      description: "plataforma para facilitar a exportação de produtos na argentina ",
      technologies: ["Next.js","Node.js","Firebase"],
      image: "/images/argpack.jpg",
      link: "https://argpack-frontend.vercel.app/",
      github: "https://github.com/KucoO1/argpack-frontend"
    },
    {
      slug: "games-hub",
      title: "Games Hub",
      description: "Mini plataforma de jogos ",
      technologies: ["React","Typescript"],
      image: "/images/gameshub.jpg",
      link: "https://jogo-memoria-e-mais.vercel.app/",
      github: "https://github.com/KucoO1/jogo-memoria-e-mais"
    },
    {
      slug: "primeflix",
      title: "PrimeFlix",
      description: "Plataforma para ver os filmes que estão em alta e seus detalhes com o uso de uma api publica ",
      technologies: ["React","axios"],
      image: "/images/primeFlix.jpg",
      link: "https://primeflix-one-chi.vercel.app/",
      github: "https://github.com/KucoO1/primeFlix"
    },
    {
      slug: "barbearia",
      title: "Barbearia",
      description: "Plataforma para fazer agendamentos em uma barbearia com painel administrativo e integração com pagamentos.",
      technologies: ["Typescript", "Next.js"],
      image: "/images/barbearia.jpg",
      link: "https://barbearia-sepia-eight.vercel.app/",
      github: "https://github.com/KucoO1/barbearia"
    }
   
  ];

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

      <HeroSection darkMode={darkMode} textIndex={textIndex} texts={texts} />
      
      <ProjectsSection darkMode={darkMode} projects={projects} />
      
      <SkillsSection darkMode={darkMode} />

      <AboutSection darkMode={darkMode} />
      
      
      <ContactSection darkMode={darkMode} /> 
      
      <Footer darkMode={darkMode} />
    </main>
  );
}