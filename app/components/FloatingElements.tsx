"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

interface FloatingElementsProps {
  elements: FloatingElement[];
  darkMode: boolean;
}

export default function FloatingElements({ elements, darkMode }: FloatingElementsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    };
    
    if (typeof window !== 'undefined') {
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkIsMobile);
      }
    };
  }, []);

  // Aumentar número de bolhas no mobile - todas as bolhas + extras
  const mobileElements = isMobile 
    ? [
        ...elements, // Todas as bolhas originais
        // Bolhas extras para mobile
        ...Array.from({ length: 8 }).map((_, i) => ({
          id: elements.length + i,
          size: 15 + Math.random() * 35, // Bolhas menores
          color: 
            i % 4 === 0 ? "yellow-light" : 
            i % 4 === 1 ? "yellow-medium" : 
            i % 4 === 2 ? "blue" : "yellow-dark",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          duration: 5 + Math.random() * 12,
          direction: Math.random() > 0.5 ? 1 : -1,
          delay: Math.random() * 1.5,
          borderRadius: Math.random() > 0.7 ? "50%" : "30%",
        }))
      ]
    : elements;

  return (
    <div className="block">
      {mobileElements.map((el) => (
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
            y: [0, (isMobile ? 10 : 12) * el.direction, 0],
            x: [0, (isMobile ? 6 : 8) * el.direction, 0],
            scale: [1, 1.05, 1],
            opacity: [0, 0.8, 0.6, 0],
            rotate: el.direction * (5 + Math.random() * 10),
          }}
          transition={{
            duration: isMobile ? el.duration * 1.2 : el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}