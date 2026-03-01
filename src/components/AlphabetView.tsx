
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TIBETAN_ALPHABET } from '../constants';
import { TibetanCharacter } from '../types';
import { FilterTab } from './Common';

export function AlphabetView({ onBack, onSelect }: { onBack: () => void; onSelect: (c: TibetanCharacter) => void }) {
  const [filter, setFilter] = useState<'all' | 'consonant' | 'vowel'>('all');

  const filtered = TIBETAN_ALPHABET.filter(c => filter === 'all' || c.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        <FilterTab active={filter === 'consonant'} onClick={() => setFilter('consonant')} label="Consonants" />
        <FilterTab active={filter === 'vowel'} onClick={() => setFilter('vowel')} label="Vowels" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <motion.button
            key={item.char}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onSelect(item)}
            className="aspect-square bg-white rounded-3xl shadow-sm border border-orange-100 flex flex-col items-center justify-center gap-1 hover:shadow-md hover:border-orange-200 transition-all active:scale-95 group"
          >
            <span className="text-3xl font-bold text-orange-900 group-hover:scale-110 transition-transform">{item.char}</span>
            <span className="text-xs font-medium text-orange-800/40 uppercase tracking-widest">{item.transliteration}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
