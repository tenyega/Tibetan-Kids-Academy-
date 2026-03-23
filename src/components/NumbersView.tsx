import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Hash, Volume2 } from 'lucide-react';
import { TIBETAN_NUMBERS } from '../constants';
import { speakTibetan } from '../services/audio';
import { cn } from './Common';

interface NumbersViewProps {
  onBack: () => void;
}

export function NumbersView({ onBack }: NumbersViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Hash className="text-blue-500" />
            Tibetan Numbers
          </h2>
          <p className="text-slate-500 font-medium">Learn to count in Tibetan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TIBETAN_NUMBERS.map((num, i) => (
          <motion.button
            key={`${num.value}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => speakTibetan(num.tibetan, num.transliteration)}
            className={cn(
              "group relative bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left overflow-hidden",
              "active:scale-95"
            )}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-4xl font-black">{num.value}</span>
            </div>
            
            <div className="space-y-1 relative z-10">
              <div className="text-4xl font-bold text-slate-900 mb-2">{num.digit}</div>
              <div className="text-xl font-medium text-blue-600">{num.tibetan}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{num.transliteration}</div>
            </div>

            <div className="absolute bottom-4 right-4 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Volume2 size={16} />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">Fun Fact!</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Tibetan numbers use a decimal system just like ours, but they have their own beautiful symbols. 
          Notice how 10 (༡༠) is made of 1 (༡) and 0 (༠)!
        </p>
      </div>
    </motion.div>
  );
}
