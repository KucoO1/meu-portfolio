"use client";

import { motion } from "framer-motion";

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
  return (
    <div className="hidden sm:block">
      {elements.map((el) => (
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
  );
}