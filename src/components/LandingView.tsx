import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

export function LandingView({ onStart, onInstall }: { onStart: () => void; onInstall: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#fefce8] to-[#fef9c3] relative z-50"
    >
      <div className="max-w-2xl w-full space-y-8 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="w-32 h-32 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-orange-200">
            <GraduationCap size={64} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-orange-900 leading-tight">
            🎓 Tibetan Kids Academy
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-orange-800/80 italic">
            Télécharger l'App / Download the App
          </h2>
          
          <div className="space-y-4 pt-4">
            <p className="text-lg text-orange-800/70 font-medium">
              Ce projet a été conçu pour préserver la culture et la langue tibétaines pour la prochaine génération.
            </p>
            <p className="text-lg text-orange-800/70 font-medium">
              This project was designed to preserve Tibetan culture and language for the next generation.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-6 pt-4"
        >
          <button 
            onClick={onInstall}
            className="w-full sm:w-auto px-12 py-5 bg-[#28a745] text-white rounded-xl font-bold text-xl shadow-lg hover:bg-[#218838] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            📲 Installer l'App / Install App
          </button>

          <button 
            onClick={onStart}
            className="text-orange-600 font-bold hover:underline transition-all"
          >
            Continuer vers la version Web / Continue to Web Version →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 space-y-4"
        >
           
         
            <div className="text-sm text-orange-800/50 font-medium bg-white/50 p-6 rounded-2xl border border-orange-100">
            ⚠️ <b>Installation Note:</b> For the best experience on Android, select <b>"Install app"</b> or <b>"Add to Home screen"</b> when prompted. 
            On iOS, tap the <b>Share</b> button and select <b>"Add to Home Screen"</b>.<br />
            📧 Need help? Contact us at <a href="mailto:tenyega23@gmail.com" className="text-orange-600 hover:underline">tenyega23@gmail.com</a>
                          <p className="text-xs text-orange-800/40 mt-2">© 2026 Tibetan Kids Academy. All rights reserved By Tenzin Yega Mundgod</p>
                                      <p className="mb-2">🔊 <b>Audio (iPhone):</b> Assurez-vous que le bouton <b>Silencieux</b> sur le côté de votre iPhone est <b>DÉSACTIVÉ</b>.</p>


          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
