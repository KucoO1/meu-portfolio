"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: "Início", href: "#hero" },
  { name: "Sobre", href: "#sobre" }, 
  { name: "Projetos", href: "#projetos" },
  { name: "Skills", href: "#skills" },
  { name: "Contacto", href: "#contacto" },
];

export default function Header({ 
  darkMode, 
  setDarkMode, 
  isMobile, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: HeaderProps) {
  return (
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
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} shadow-lg transition-all duration-300 hover:scale-110`}
            aria-label="Alternar modo claro/escuro"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="md:hidden p-2 rounded-lg bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
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
  );
}