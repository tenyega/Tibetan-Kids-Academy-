import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, ChevronLeft } from 'lucide-react';
import { TibetanCharacter } from '../types';
import { speakTibetan } from '../services/audio';

export function CharacterModal({ char, onClose }: { char: TibetanCharacter; onClose: () => void }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    await speakTibetan(char.char, char.transliteration, char.audioPath);
    setIsSpeaking(false);
  };

  const handleSpeakExample = async () => {
    if (!char.exampleWord) return;
    setIsSpeaking(true);
    await speakTibetan(char.exampleWord, char.exampleMeaning || '', char.exampleAudioPath);
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6">
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
            <ChevronLeft className="rotate-270" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-orange-50 rounded-[2rem] flex items-center justify-center text-6xl font-bold text-orange-900">
              {char.char}
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-orange-900 uppercase">{char.transliteration}</h3>
              <p className="text-orange-800/40 font-bold tracking-widest uppercase text-sm">{char.category}</p>
              <button 
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors disabled:opacity-50"
              >
                <Volume2 size={20} />
                <span>Listen</span>
              </button>
            </div>
          </div>

          {char.exampleWord && (
            <div className="bg-blue-50 p-6 rounded-3xl space-y-4">
              {char.imagePath && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white border border-blue-100">
                  <img 
                    src={char.imagePath} 
                    alt={char.exampleMeaning} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800/40 uppercase tracking-widest">Example Word</span>
                <button 
                  onClick={handleSpeakExample}
                  disabled={isSpeaking}
                  className="p-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-blue-900">{char.exampleWord}</span>
                <div className="flex flex-col">
                  <span className="text-xl text-blue-800/60 font-medium italic">{char.exampleMeaning}</span>
                  {char.exampleMeaningFr && (
                    <span className="text-lg text-blue-800/40 font-medium italic">{char.exampleMeaningFr}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onClose}
            className="w-full bg-orange-500 text-white p-5 rounded-3xl font-bold text-lg shadow-xl shadow-orange-200 hover:bg-orange-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
