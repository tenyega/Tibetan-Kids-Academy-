import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from './Common';
import confetti from 'canvas-confetti';
import { TIBETAN_ALPHABET } from '../constants';

interface MatchItem {
  id: string;
  char: string;
  word: string;
  image: string;
}

interface Selection {
  type: 'image' | 'word';
  id: string;
}

export function MatchingView({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<string[]>([]); // IDs of matched pairs
  const [selection, setSelection] = useState<Selection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWin, setShowWin] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Game Data
  const gameData = useMemo(() => {
    const pool = TIBETAN_ALPHABET.filter(item => item.exampleWord && item.imagePath);
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    
    const images = selected.map(item => ({ id: item.char, content: item.imagePath }))
      .sort(() => Math.random() - 0.5);
    
    const words = selected.map(item => ({ id: item.char, content: item.exampleWord }))
      .sort(() => Math.random() - 0.5);

    return { images, words, original: selected };
  }, []);

  const handleItemClick = (type: 'image' | 'word', id: string) => {
    if (matches.includes(id)) return;
    setError(null);

    if (!selection) {
      setSelection({ type, id });
      return;
    }

    if (selection.type === type) {
      // Change selection within same column
      setSelection({ type, id });
      return;
    }

    // Check match
    if (selection.id === id) {
      // Success
      const newMatches = [...matches, id];
      setMatches(newMatches);
      setSelection(null);
      setScore(s => s + 1);
      
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });

      if (newMatches.length === gameData.original.length) {
        setTimeout(() => {
          setShowWin(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    } else {
      // Failure
      setError("Try again! / ཡང་བསྐྱར་གྱིས།");
      setSelection(null);
      setTimeout(() => setError(null), 2000);
    }
  };

  // Helper to get coordinates for lines
  const getCoords = (id: string, type: 'image' | 'word') => {
    const el = document.getElementById(`${type}-${id}`);
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };

    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: type === 'image' ? rect.right - containerRect.left : rect.left - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  };

  if (showWin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 pt-12"
      >
        <div className="relative inline-block">
          <div className="w-48 h-48 bg-green-100 rounded-full flex items-center justify-center text-7xl">
            🏆
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-green-400 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-green-900">Perfect Match!</h2>
          <p className="text-xl text-green-800/60 font-medium">You matched all the words!</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full bg-green-500 text-white p-5 rounded-3xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-600 transition-colors"
        >
          Back to Games
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-4"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-indigo-100 rounded-full text-indigo-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-indigo-800/40 uppercase tracking-widest">Matching Fun</span>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle2 size={16} className="text-indigo-500" />
            <span className="text-sm font-bold text-indigo-900">{matches.length}/{gameData.original.length} Matched</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-bold">
          <Star size={16} className="fill-indigo-500 text-indigo-500" />
          <span>{score * 20}</span>
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        {/* SVG Layer for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {matches.map(id => {
            const start = getCoords(id, 'image');
            const end = getCoords(id, 'word');
            return (
              <line 
                key={id}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
                className="opacity-40"
              />
            );
          })}
          {selection && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={getCoords(selection.id, selection.type).x}
              y1={getCoords(selection.id, selection.type).y}
              x2={getCoords(selection.id, selection.type).x} // Temporary
              y2={getCoords(selection.id, selection.type).y} // Temporary
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        <div className="grid grid-cols-2 gap-12 relative z-10">
          {/* Images Column */}
          <div className="space-y-4">
            {gameData.images.map((img) => (
              <button
                id={`image-${img.id}`}
                key={img.id}
                onClick={() => handleItemClick('image', img.id)}
                className={cn(
                  "w-full aspect-square rounded-2xl border-4 overflow-hidden transition-all active:scale-95",
                  selection?.id === img.id && selection.type === 'image' ? "border-indigo-500 ring-4 ring-indigo-100" : "border-white shadow-sm",
                  matches.includes(img.id) ? "opacity-50 grayscale border-green-500" : "hover:border-indigo-200"
                )}
              >
                <img 
                  src={img.content} 
                  alt="Match" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Words Column */}
          <div className="space-y-4">
            {gameData.words.map((word) => (
              <button
                id={`word-${word.id}`}
                key={word.id}
                onClick={() => handleItemClick('word', word.id)}
                className={cn(
                  "w-full aspect-square rounded-2xl border-4 bg-white flex items-center justify-center p-2 transition-all active:scale-95",
                  selection?.id === word.id && selection.type === 'word' ? "border-indigo-500 ring-4 ring-indigo-100" : "border-white shadow-sm",
                  matches.includes(word.id) ? "opacity-50 border-green-500" : "hover:border-indigo-200"
                )}
              >
                <span className="text-2xl font-black text-indigo-900 break-words text-center">
                  {word.content}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-900 font-bold shadow-lg"
          >
            <AlertCircle className="text-red-500" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <p className="text-sm text-indigo-900 font-medium">
          Tap an image on the left, then find its matching word on the right!
        </p>
      </div>
    </motion.div>
  );
}
