"use client";

import { motion } from "framer-motion";

interface AboutSectionProps {
  darkMode: boolean;
}

export default function AboutSection({ darkMode }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-16 md:py-24 px-4 sm:px-6 relative z-10">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl sm:text-4xl font-bold mb-8 text-center text-yellow-400"
        >
          Sobre Mim
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center lg:text-left"
          >
            <div className="w-64 h-64 lg:w-80 lg:h-80 mx-auto lg:mx-0 mb-8 relative"> {/* Aumentado apenas para LG */}
              <div className={`absolute -inset-4 lg:-inset-5 bg-yellow-400/20 rounded-3xl blur-xl ${darkMode ? 'opacity-30' : 'opacity-20'}`}></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-yellow-400">
                <div className={`w-full h-full bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
                  <span className="text-6xl lg:text-8xl">👨‍💻</span> {/* Aumentado apenas para LG */}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-yellow-400">Nataniel Oliveira</h3>
            
            <p className="text-lg leading-relaxed">
              Sou um desenvolvedor Fullstack apaixonado por tecnologia e inovação. 
              Com mais de 5 anos de experiência, tenho dedicado minha carreira a criar 
              soluções digitais que fazem a diferença na vida das pessoas.
            </p>
            
            <p className="text-lg leading-relaxed">
              Minha expertise abrange desde o desenvolvimento front-end com React e Next.js 
              até o back-end com Node.js e diversas bases de dados. Acredito que a tecnologia 
              deve ser não apenas funcional, mas também intuitiva e agradável de usar.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                <div className="text-2xl font-bold text-yellow-400">5+</div>
                <div className="text-sm">Anos de Experiência</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                <div className="text-2xl font-bold text-yellow-400">50+</div>
                <div className="text-sm">Projetos Concluídos</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                <div className="text-2xl font-bold text-yellow-400">20+</div>
                <div className="text-sm">Clientes Satisfeitos</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                <div className="text-2xl font-bold text-yellow-400">100%</div>
                <div className="text-sm">Dedicado</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}