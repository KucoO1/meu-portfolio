"use client";

import { motion } from "framer-motion";

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
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
  );
}