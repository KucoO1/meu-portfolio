"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface ContactSectionProps {
  darkMode: boolean;
}

export default function ContactSection({ darkMode }: ContactSectionProps) {
  const { t } = useLanguage();
  return (
    <section id="contacto" className="py-16 md:py-24 px-4 sm:px-6 relative z-10">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl sm:text-4xl font-bold mb-4 text-center text-yellow-400"
        >
          {t.contact.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-lg text-center max-w-2xl mx-auto"
        >
          {t.contact.subtitle}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Informações de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-yellow-400">{t.contact.infoTitle}</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-400/20' : 'bg-yellow-400/10'}`}>
                  <Mail className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="font-semibold">{t.contact.email}</p>
                  <p className="text-gray-400">natanieloliveiradev@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-400/20' : 'bg-yellow-400/10'}`}>
                  <Phone className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="font-semibold">{t.contact.phone}</p>
                  <p className="text-gray-400">+244 948 142 984</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-400/20' : 'bg-yellow-400/10'}`}>
                  <MapPin className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="font-semibold">{t.contact.location}</p>
                  <p className="text-gray-400">{t.contact.locationValue}</p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.contact.followMe}</h4>
              <div className="flex gap-4">
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <Linkedin className="text-yellow-400" size={20} />
                </a>
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <Github className="text-yellow-400" size={20} />
                </a>
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <Instagram className="text-yellow-400" size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Formulário de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className="text-2xl font-semibold mb-6 text-yellow-400">{t.contact.formTitle}</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formName}</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors`}
                    placeholder={t.contact.formNamePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formEmail}</label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors`}
                    placeholder={t.contact.formEmailPlaceholder}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.formSubject}</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors`}
                  placeholder={t.contact.formSubjectPlaceholder}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.formMessage}</label>
                <textarea 
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors`}
                  placeholder={t.contact.formMessagePlaceholder}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {t.contact.formSubmit}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}