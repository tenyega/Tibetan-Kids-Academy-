import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Trophy, Hash } from 'lucide-react';

export function HomeView({ onStart, onQuiz, onNumbers }: { onStart: () => void; onQuiz: () => void; onNumbers: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pt-8"
    >
      <div className="text-center space-y-4">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-32 h-32 bg-orange-100 rounded-full mx-auto flex items-center justify-center text-6xl shadow-inner"
        >
          ཀ
        </motion.div>
        <h2 className="text-3xl font-black text-orange-900">Tashi Delek!</h2>
        <p className="text-orange-800/60 font-medium px-4">Ready to learn the beautiful Tibetan language?</p>
      </div>

      <div className="grid gap-4">
        <button 
          onClick={onStart}
          className="group relative bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-[2.5rem] shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <BookOpen size={80} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Start Learning</h3>
            <p className="text-white/80 text-sm">Alphabet and words</p>
          </div>
        </button>

        <button 
          onClick={onNumbers}
          className="group relative bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Hash size={80} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Hash size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Tibetan Numbers</h3>
            <p className="text-white/80 text-sm">Learn to count 1 to 100</p>
          </div>
        </button>

        <button 
          onClick={onQuiz}
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Gamepad2 size={80} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Play Games</h3>
            <p className="text-white/80 text-sm">Test your knowledge</p>
          </div>
        </button>
      </div>

      <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
          <Trophy size={24} />
        </div>
        <div>
          <h4 className="font-bold text-green-900">Daily Goal</h4>
          <p className="text-green-800/60 text-sm">Learn 5 new letters today!</p>
        </div>
      </div>
    </motion.div>
  );
}
