"use client";

import { motion } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  darkMode: boolean;
  textIndex: number;
  texts: string[];
}

export default function HeroSection({ darkMode, textIndex, texts }: HeroSectionProps) {
  return (
    <section id="hero" className="relative flex flex-col md:flex-row items-center justify-center min-h-screen text-center md:text-left px-4 md:px-6 gap-6 md:gap-12 z-10 pt-16 md:pt-20">
      <div className="max-w-xl order-2 md:order-1">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Olá, eu sou <span className="text-yellow-400">Nataniel Oliveira,</span><br />
          <motion.span
            key={textIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-yellow-400 block mt-2 text-2xl sm:text-3xl md:text-4xl"
          >
            {texts[textIndex]}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-base sm:text-xl"
        >
          Desenvolvedor <span className="text-yellow-400">Fullstack</span> apaixonado por criar soluções digitais modernas e impactantes.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-4 leading-relaxed text-gray-400 text-sm sm:text-base"
        >
          Com mais de 5 anos de experiência, especializo-me em criar aplicações web and mobile performáticas, escaláveis e com foco na experiência do usuário.
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

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-shrink-0 order-1 md:order-2 relative group w-48 h-48 sm:w-80 sm:h-80 md:w-[420px] md:h-[500px]"
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

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 hidden md:block"
      >
        <ArrowDownCircle size={36} className={darkMode ? "text-gray-400" : "text-gray-600"} />
      </motion.div>
    </section>
  );
}