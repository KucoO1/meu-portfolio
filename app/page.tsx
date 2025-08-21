"use client";

import { motion } from "framer-motion";
import { ArrowDownCircle, Sun, Moon, ExternalLink, Github, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const texts = ["Programador", "Desenvolvedor Fullstack", "Criativo"];
  
  // Verificar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Efeito de digitação
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = Array.from({ length: 16 }).map((_, i) => ({
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

  // Dados de projetos (exemplo)
  const projects = [
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

  // Navegação
  const navItems = [
    { name: "Início", href: "#hero" },
    { name: "Projetos", href: "#projetos" },
    { name: "Skills", href: "#skills" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <main className={`relative min-h-screen overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>
      {/* Header e Navegação - removido fixed em mobile */}
      <header className={`w-full ${isMobile ? 'relative' : 'fixed top-0'} z-50 py-4 px-6 backdrop-blur-sm bg-opacity-90 bg-gray-950 border-b border-gray-800`}>
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-yellow-400"
          >
            Nataniel Oliveira
          </motion.div>
          
          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:text-yellow-400 transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Botão de modo claro/escuro */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} shadow-lg transition-all duration-300 hover:scale-110`}
              aria-label="Alternar modo claro/escuro"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Botão Menu Mobile */}
            <button 
              className="md:hidden p-2 rounded-lg bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-gray-900 rounded-lg p-4"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="py-2 px-4 hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Elementos flutuantes - menos em mobile para melhor performance */}
      <div className="hidden sm:block">
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className={`absolute ${
              el.borderRadius === "50%" ? "rounded-full" : "rounded-[30%]"
            } ${
              el.color === "yellow-light"
                ? darkMode ? "bg-yellow-300/30" : "bg-yellow-400/40"
                : el.color === "yellow-medium"
                ? darkMode ? "bg-yellow-500/25" : "bg-yellow-500/35"
                : el.color === "blue"
                ? darkMode ? "bg-blue-400/30" : "bg-blue-500/40"
                : darkMode ? "bg-amber-600/20" : "bg-amber-500/30"
            }`}
            style={{
              width: el.size,
              height: el.size,
              top: el.top,
              left: el.left,
            }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, 12 * el.direction, 0],
              x: [0, 8 * el.direction, 0],
              scale: [1, 1.05, 1],
              opacity: [0, 0.8, 0.6, 0],
              rotate: el.direction * (5 + Math.random() * 10),
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Overlay de fundo */}
      <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-yellow-400/8 via-transparent to-amber-300/8' : 'from-yellow-200/20 via-transparent to-amber-100/20'} z-0`} />

      {/* Hero Section - ajustado padding para mobile */}
      <section id="hero" className="relative flex flex-col md:flex-row items-center justify-center min-h-screen text-center md:text-left px-4 md:px-6 gap-6 md:gap-12 z-10 pt-16 md:pt-20">
        <div className="max-w-xl order-2 md:order-1">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight" // Reduzido tamanho para mobile
          >
            Olá, eu sou <span className="text-yellow-400">Nataniel Oliveira,</span><br />
            <motion.span
              key={textIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-yellow-400 block mt-2 text-2xl sm:text-3xl md:text-4xl" // Reduzido tamanho para mobile
            >
              {texts[textIndex]}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 text-base sm:text-xl" // Ajustado para mobile
          >
            Desenvolvedor <span className="text-yellow-400">Fullstack</span> apaixonado por criar soluções digitais modernas e impactantes.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-4 leading-relaxed text-gray-400 text-sm sm:text-base" // Ajustado para mobile
          >
            Com mais de 5 anos de experiência, especializo-me em criar aplicações web e mobile performáticas, escaláveis e com foco na experiência do usuário.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start"
          >
            <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Ver Projetos
            </button>
            <button className={`border ${darkMode ? 'border-yellow-400 text-yellow-400' : 'border-gray-800 text-gray-800'} px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}>
              Entrar em Contato
            </button>
          </motion.div>
        </div>

        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0 order-1 md:order-2 relative group w-48 h-48 sm:w-80 sm:h-80 md:w-[420px] md:h-[500px]" // Reduzido tamanho para mobile
        >
          <div className={`absolute -inset-2 sm:-inset-4 bg-yellow-400/30 rounded-2xl blur-lg group-hover:bg-yellow-400/50 group-hover:blur-xl transition-all duration-300 ${darkMode ? 'opacity-30' : 'opacity-20'}`}></div>
          <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/nataniel.jpg"
              alt="Foto de perfil de Nataniel Oliveira"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Scroll Down */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 hidden md:block"
        >
          <ArrowDownCircle size={36} className={darkMode ? "text-gray-400" : "text-gray-600"} />
        </motion.div>
      </section>

      {/* Projetos Section - títulos centralizados */}
      <section
        id="projetos"
        className="py-16 md:py-24 px-4 sm:px-6 text-center relative z-10"
      >
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-400"
          >
            Meus Projetos
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-8 sm:mb-12 max-w-2xl mx-auto text-lg"
          >
            Confira alguns dos meus trabalhos mais recentes e representativos
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                className={`p-1 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 group cursor-pointer ${darkMode ? '' : 'shadow-lg'}`}
              >
                <div className={`p-4 sm:p-6 rounded-2xl h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-all duration-300`}>
                  <div className="relative h-40 sm:h-48 mb-4 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${darkMode ? 'from-yellow-400/20 to-amber-600/20' : 'from-yellow-200/30 to-amber-300/30'} z-0`}></div>
                    <div className="absolute bottom-4 left-0 right-0 z-20 text-center px-4"> {/* Centralizado */}
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    </div>
                  </div>
                  
                  <p className="mb-4 text-left text-sm sm:text-base">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs sm:text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs sm:text-sm">
                    <a href={project.link} className="flex items-center gap-1 sm:gap-2 hover:text-yellow-400 transition-colors">
                      <ExternalLink size={14} />
                      Ver projeto
                    </a>
                    <a href={project.github} className="flex items-center gap-1 sm:gap-2 hover:text-yellow-400 transition-colors">
                      <Github size={14} />
                      Código
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-16 md:py-24 px-4 sm:px-6 text-center relative z-10"
      >
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-400"
          >
            Minhas Skills
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-8 sm:mb-12 max-w-2xl mx-auto text-lg"
          >
            Tecnologias e ferramentas que utilizo para transformar ideias em realidade
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { name: "Next.js", level: 90, img: "/images/next-js-svgrepo-com (1).svg" },
              { name: "React.js", level: 95, img: "/images/reactjs.png" },
              { name: "Node.js + Express", level: 85, img: "/images/node-js-svgrepo-com.svg" },
              { name: "HTML", level: 95, img: "/images/html-5-svgrepo-com.svg" },
              { name: "CSS", level: 90, img: "/images/css-3-svgrepo-com.svg" },
              { name: "C#", level: 80, img: "/images/csharp.svg" },
              { name: "MySQL", level: 85, img: "/images/database-svgrepo-com.svg" },
              { name: "MongoDB", level: 75, img: "/images/mongodb-opened-svgrepo-com.svg" },
              { name: "Flutter", level: 70, img: "/images/flutter-svgrepo-com.svg" },
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.03 }}
                className={`text-center p-4 sm:p-6 rounded-2xl shadow-lg transition-all ${darkMode ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-white/80 hover:bg-white'} border border-yellow-400/10 hover:border-yellow-400/30`}
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{skill.name}</h3>
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src={skill.img}
                    alt={skill.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-4 sm:h-5 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-900">
                    {skill.level}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-8 sm:mt-12 text-lg sm:text-xl italic"
          >
            E Muito mais +
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className={`py-12 text-center ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} relative z-10`}>
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl font-bold mb-6 text-yellow-400"
          >
            Vamos trabalhar juntos?
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-6 sm:mb-8 max-w-2xl mx-auto text-lg"
          >
            Estou sempre aberto a discutir novos projetos e oportunidades.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-gray-900 px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Entrar em Contato
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-8 sm:mt-12 pt-6 border-t border-gray-700/30"
          >
            <p>© {new Date().getFullYear()} Nataniel Oliveira. Todos os direitos reservados.</p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}