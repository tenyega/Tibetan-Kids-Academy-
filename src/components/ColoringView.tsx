import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Sparkles, Palette, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import { cn } from './Common';
import confetti from 'canvas-confetti';
import { TIBETAN_ALPHABET } from '../constants';

interface Segment {
  id: string;
  char: string;
  d: string;
  isBg?: boolean;
  labelPos: { x: number; y: number };
}

interface Level {
  id: number;
  name: string;
  segments: Omit<Segment, 'char'>[];
  themeColor: string;
  icon: string;
  decorativePaths?: string[];
}

const LEVELS: Level[] = [
{
  id: 2,
  name: "Pikachu with Heart",
  themeColor: "bg-pink-500",
  icon: "❤️",
  segments: [
    { id: 'body_face', d: 'M 22.4 7.2 L 30.7 15.9 L 33.8 26.1 L 48.7 23.3 L 61.1 29.9 L 74.3 18.9 L 84.8 14.7 L 86.2 17.3 L 84.9 27.3 L 75.5 33.2 L 65.5 35.3 L 64.8 48.5 L 55.3 48.1 L 47.0 54.2 L 38.4 49.5 L 41.7 57.3 L 29.6 61.5 L 51.6 57.4 L 55.3 62.2 L 46.7 70.2 L 40.3 74.3 L 35.6 79.7 L 50.3 88.7 L 58.6 92.0 L 49.3 96.9 L 33.9 95.6 L 27.4 91.2 L 22.9 83.5 L 21.5 76.6 L 21.8 69.9 L 25.8 58.1 L 24.1 47.2 L 28.4 30.6 L 17.7 20.8 Z', labelPos: { x: 44, y: 58 } },
    { id: 'tail', d: 'M 3.3 31.4 L 11.0 34.2 L 24.1 41.0 L 22.5 48.8 L 22.8 56.4 L 21.0 62.5 L 22.8 63.5 L 21.0 68.0 L 19.8 76.0 L 19.0 72.9 L 18.7 67.6 L 15.5 67.0 L 15.6 57.1 L 7.1 57.7 L 6.5 56.5 L 4.5 46.8 Z', labelPos: { x: 16, y: 57 } },
    { id: 'heart', d: 'M 55.9 49.1 L 61.3 48.9 L 64.7 50.2 L 68.4 53.8 L 70.9 58.2 L 73.6 54.9 L 76.5 52.0 L 82.3 49.9 L 86.8 50.3 L 90.4 51.8 L 92.6 53.9 L 94.3 57.7 L 94.9 60.6 L 94.4 65.5 L 90.9 73.0 L 82.6 83.4 L 70.1 94.7 L 60.7 86.1 L 60.2 77.8 L 58.3 73.9 L 51.6 73.9 L 49.3 69.8 L 55.3 64.9 L 56.9 62.2 L 53.3 56.9 L 48.1 56.5 L 51.1 51.6 Z', labelPos: { x: 69, y: 62 } },
    { id: 'left_eye', d: 'M 35.6 38.4 L 33.9 38.3 L 32.5 38.8 L 31.6 39.7 L 30.7 41.2 L 30.2 43.4 L 30.4 44.9 L 31.5 46.8 L 32.4 47.3 L 34.0 47.6 L 35.0 47.5 L 36.1 46.7 L 37.0 45.7 L 37.9 44.0 L 38.3 42.6 L 38.3 41.0 L 38.0 40.0 L 36.8 38.7 Z', labelPos: { x: 34, y: 43 } },
    { id: 'right_eyebrow', d: 'M 50.5 45.8 L 50.9 47.4 L 52.2 47.4 L 53.9 46.0 L 55.3 45.6 L 57.2 46.8 L 58.2 46.2 L 58.1 45.1 L 57.1 44.0 L 54.2 42.9 L 52.7 43.0 L 51.0 44.6 Z', labelPos: { x: 54, y: 46 } },
    { id: 'cheek', d: 'M 40.3 54.4 L 41.6 53.0 L 43.0 52.5 L 44.4 52.6 L 45.7 53.4 L 46.1 54.2 L 45.4 55.6 L 44.6 56.4 L 43.8 56.6 L 42.4 56.6 L 41.1 56.0 L 40.3 54.8 Z', labelPos: { x: 43, y: 54 } },
    { id: 'hand1', d: 'M 30.4 77.0 L 29.8 77.8 L 24.2 80.6 L 22.5 81.6 L 21.8 79.2 L 21.8 78.3 L 25.6 77.1 L 27.9 76.6 L 30.1 76.8 Z', labelPos: { x: 26, y: 79 } },
    { id: 'hand2', d: 'M 29.3 71.0 L 28.2 71.9 L 23.6 73.6 L 21.9 74.3 L 21.5 71.9 L 24.4 70.5 L 26.2 70.1 L 28.5 70.3 Z', labelPos: { x: 25, y: 72 } },
    { id: 'bg', d: 'M 0 0 L 100 0 L 100 100 L 0 100 Z', isBg: true, labelPos: { x: 5, y: 5 } },
  ]
},  {
    id: 2,
    name: "Pikachu with Heart",
    themeColor: "bg-pink-500",
    icon: "❤️",
    segments: [
      { id: 'ph1', d: 'M 35 30 L 15 5 C 20 5 25 10 35 25 Z', labelPos: { x: 28, y: 18 } }, // Left Ear
      { id: 'ph2', d: 'M 65 30 L 85 5 C 80 5 75 10 65 25 Z', labelPos: { x: 72, y: 18 } }, // Right Ear
      { id: 'ph3', d: 'M 35 30 C 45 20 55 20 65 30 C 75 40 75 50 65 60 C 55 70 45 70 35 60 C 25 50 25 40 35 30 Z', labelPos: { x: 50, y: 45 } }, // Face
      { id: 'ph4', d: 'M 50 60 C 65 45 85 55 85 75 C 85 90 65 100 50 100 C 35 100 15 90 15 75 C 15 55 35 45 50 60', labelPos: { x: 50, y: 80 } }, // Heart
      { id: 'ph5', d: 'M 35 60 L 25 85 L 45 90 L 45 75 Z', labelPos: { x: 35, y: 80 } }, // Left Arm
      { id: 'ph6', d: 'M 65 60 L 75 85 L 55 90 L 55 75 Z', labelPos: { x: 65, y: 80 } }, // Right Arm
      { id: 'ph7', d: 'M 0 0 L 100 0 L 100 100 L 0 100 Z', isBg: true, labelPos: { x: 10, y: 10 } }, // Background
    ]
  },
  {
    id: 3,
    name: "Spider Hero",
    themeColor: "bg-red-600",
    icon: "🕷️",
    segments: [
      { id: 'sh1', d: 'M 50 10 C 75 10 85 35 85 55 C 85 80 50 95 15 80 C 15 35 25 10 50 10 Z', labelPos: { x: 50, y: 35 } }, // Large Mask
      { id: 'sh2', d: 'M 30 50 Q 40 35 50 50 Q 40 70 30 50 Z', labelPos: { x: 40, y: 52 } }, // Left Eye
      { id: 'sh3', d: 'M 70 50 Q 60 35 50 50 Q 60 70 70 50 Z', labelPos: { x: 60, y: 52 } }, // Right Eye
      { id: 'sh4', d: 'M 20 80 L 5 100 L 35 100 L 40 90 Z', labelPos: { x: 22, y: 95 } }, // Left Body
      { id: 'sh5', d: 'M 80 80 L 95 100 L 65 100 L 60 90 Z', labelPos: { x: 78, y: 95 } }, // Right Body
      { id: 'sh6', d: 'M 40 90 L 45 100 L 55 100 L 60 90 Z', labelPos: { x: 50, y: 96 } }, // Center Chest
      { id: 'sh7', d: 'M 0 0 L 100 0 L 100 100 L 0 100 Z', isBg: true, labelPos: { x: 10, y: 10 } }, // Background
    ],
    decorativePaths: [
      'M 50 10 L 50 95', // Vertical web
      'M 15 80 Q 50 60 85 80', // Horizontal web 1
      'M 20 40 Q 50 25 80 40', // Horizontal web 2
      'M 25 60 Q 50 75 75 60', // Horizontal web 3
      'M 45 90 L 55 90 L 50 95 Z' // Spider logo hint
    ]
  }
];

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#06b6d4', '#ec4899', '#f97316', '#a855f7'];

export function ColoringView({ onBack }: { onBack: () => void }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [filledSegments, setFilledSegments] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showWin, setShowWin] = useState(false);

  const currentLevel = LEVELS[currentLevelIdx];

  // Randomize characters for the current level
  const levelData = useMemo(() => {
    const colorableSegments = currentLevel.segments.filter(s => !s.isBg);
    const chars = [...TIBETAN_ALPHABET]
      .sort(() => Math.random() - 0.5)
      .slice(0, colorableSegments.length);
    
    const segments = currentLevel.segments.map(s => {
      if (s.isBg) return { ...s, char: '' };
      const idx = colorableSegments.findIndex(cs => cs.id === s.id);
      return { ...s, char: chars[idx].char };
    });

    const colorKey = chars.map((c, i) => ({
      char: c.char,
      color: COLORS[i % COLORS.length]
    }));

    return { segments, colorKey, totalColorable: colorableSegments.length };
  }, [currentLevelIdx]);

  const totalToFill = levelData.totalColorable;

  const handleSegmentClick = (segment: Segment) => {
    if (segment.isBg || filledSegments[segment.id]) return;
    
    if (selectedChar === segment.char) {
      const color = levelData.colorKey.find(k => k.char === segment.char)?.color || '#ccc';
      setFilledSegments(prev => {
        const next = { ...prev, [segment.id]: color };
        if (Object.keys(next).length === totalToFill) {
          setShowWin(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        return next;
      });
      setScore(s => s + 1);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setFilledSegments({});
      setSelectedChar(null);
      setShowWin(false);
    } else {
      onBack();
    }
  };

  if (showWin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 pt-12"
      >
        <div className="relative inline-block">
          <div className={cn("w-48 h-48 rounded-full flex items-center justify-center text-7xl", currentLevel.themeColor.replace('bg-', 'bg-opacity-20 bg-'))}>
            {currentLevelIdx === LEVELS.length - 1 ? '👑' : '🎨'}
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={cn("absolute inset-0 border-4 border-dashed rounded-full", currentLevel.themeColor.replace('bg-', 'border-'))}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900">
            {currentLevelIdx === LEVELS.length - 1 ? "Ultimate Artist!" : "Level Complete!"}
          </h2>
          <p className="text-xl text-slate-600 font-medium">
            {currentLevelIdx === LEVELS.length - 1 
              ? "You've colored all the pictures! Amazing!" 
              : `You finished the ${currentLevel.name}!`}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={nextLevel}
            className={cn(
              "w-full text-white p-5 rounded-3xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2",
              currentLevel.themeColor
            )}
          >
            {currentLevelIdx === LEVELS.length - 1 ? "Finish Game" : "Next Picture"}
            <ArrowRight size={20} />
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-slate-100 text-slate-600 p-4 rounded-3xl font-bold hover:bg-slate-200 transition-colors"
          >
            Back to Games
          </button>
        </div>
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
          className="p-2 hover:bg-slate-100 rounded-full text-slate-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coloring Level {currentLevel.id}/3</span>
          <h2 className="text-lg font-black text-slate-900">{currentLevel.name}</h2>
        </div>

        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold">
          <Star size={16} className="fill-yellow-500 text-yellow-500" />
          <span>{score * 10}</span>
        </div>
      </div>

      {/* Main Coloring Area */}
      <div className="relative bg-white rounded-[3rem] shadow-xl shadow-slate-200 border-4 border-slate-50 p-4 aspect-square flex items-center justify-center overflow-hidden">
        <svg key={currentLevelIdx} viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Background Segment First */}
          {levelData.segments.filter(s => s.isBg).map(s => (
            <path
              key={s.id}
              d={s.d}
              fill={filledSegments[s.id] || '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.5"
              className="transition-colors duration-500"
            />
          ))}

          {/* Decorative Paths */}
          {currentLevel.decorativePaths?.map((d, i) => (
            <path
              key={`dec-${i}`}
              d={d}
              fill="none"
              stroke="#475569"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              className="pointer-events-none opacity-30"
            />
          ))}

          {/* Other Segments */}
          {levelData.segments.filter(s => !s.isBg).map(s => (
            <g key={s.id} onClick={() => handleSegmentClick(s as Segment)} className="cursor-pointer group">
              <path
                d={s.d}
                fill={filledSegments[s.id] || '#fff'}
                stroke="#475569"
                strokeWidth="1"
                className="transition-colors duration-500"
              />
              {!filledSegments[s.id] && (
                <text
                  x={s.labelPos.x}
                  y={s.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[6px] font-bold fill-slate-500 pointer-events-none select-none"
                  style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '1px' }}
                >
                  {s.char}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Color Palette / Key */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Palette size={14} />
            Color Key
          </h3>
          <span className="text-xs font-bold text-slate-400">{Object.keys(filledSegments).length}/{totalToFill} Completed</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {levelData.colorKey.map((item) => (
            <button
              key={item.char}
              onClick={() => setSelectedChar(item.char)}
              className={cn(
                "relative flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all active:scale-90",
                selectedChar === item.char 
                  ? "border-slate-900 bg-slate-50 shadow-md" 
                  : "border-transparent bg-white shadow-sm hover:bg-slate-50"
              )}
            >
              <div 
                className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-white"
                style={{ backgroundColor: item.color }}
              >
                {selectedChar === item.char && <CheckCircle2 size={16} />}
              </div>
              <span className="text-lg font-bold text-slate-900">{item.char}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <p className="text-sm text-blue-900 font-medium">
          Pick a character from the key, then find it in the picture to color it!
        </p>
      </div>
    </motion.div>
  );
}
