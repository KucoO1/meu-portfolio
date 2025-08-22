"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Skill {
  name: string;
  level: number;
  img: string;
}

interface SkillsSectionProps {
  darkMode: boolean;
}

const skills: Skill[] = [
  { name: "Next.js", level: 90, img: "/images/next-js-svgrepo-com (1).svg" },
  { name: "React.js", level: 95, img: "/images/reactjs.png" },
  { name: "Node.js + Express", level: 85, img: "/images/node-js-svgrepo-com.svg" },
  { name: "HTML", level: 95, img: "/images/html-5-svgrepo-com.svg" },
  { name: "CSS", level: 90, img: "/images/css-3-svgrepo-com.svg" },
  { name: "C#", level: 80, img: "/images/csharp.svg" },
  { name: "MySQL", level: 85, img: "/images/database-svgrepo-com.svg" },
  { name: "MongoDB", level: 75, img: "/images/mongodb-opened-svgrepo-com.svg" },
  { name: "Flutter", level: 70, img: "/images/flutter-svgrepo-com.svg" },
];

export default function SkillsSection({ darkMode }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 text-center relative z-10">
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
          {skills.map((skill, i) => (
            <SkillCard key={i} skill={skill} index={i} darkMode={darkMode} />
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
  );
}

function SkillCard({ skill, index, darkMode }: { skill: Skill; index: number; darkMode: boolean }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }} // Apenas margem inferior
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
          transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }} // Margem inferior menor
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg"
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-900">
          {skill.level}%
        </span>
      </div>
    </motion.div>
  );
}