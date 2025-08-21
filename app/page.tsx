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
      title: "E-commerce Platform",
      description: "Plataforma completa de e-commerce com painel administrativo e integração com pagamentos.",
      technologies: ["Next.js", "Node.js", "MongoDB"],
      image: "/images/project1.jpg",
      link: "#",
      github: "#"
    },
    {
      title: "App de Gestão Financeira",
      description: "Aplicativo para controle de finanças pessoais com relatórios e gráficos.",
      technologies: ["React Native", "Firebase", "Chart.js"],
      image: "/images/project2.jpg",
      link: "#",
      github: "#"
    },
    {
      title: "Sistema de Agendamentos",
      description: "Sistema para agendamento de serviços com confirmação por e-mail e SMS.",
      technologies: ["Vue.js", "Express", "MySQL"],
      image: "/images/project3.jpg",
      link: "#",
      github: "#"
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