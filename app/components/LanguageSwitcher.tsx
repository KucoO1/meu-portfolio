"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "../i18n/types";

export default function LanguageSwitcher({ darkMode }: { darkMode: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-1.5 p-2 rounded-full ${
          darkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-200 text-gray-800"
        } shadow-lg transition-all duration-300 hover:scale-110`}
        aria-label={t.header.language}
      >
        <Globe size={20} />
        <span className="text-sm hidden sm:inline">{LOCALE_FLAGS[locale]}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl border overflow-hidden z-50 ${
              darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            }`}
          >
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                } ${loc === locale ? "text-yellow-400 font-semibold" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <span>{LOCALE_FLAGS[loc]}</span>
                  <span>{LOCALE_LABELS[loc]}</span>
                </span>
                {loc === locale && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
