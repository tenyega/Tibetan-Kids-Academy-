import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Image as ImageIcon, BookOpen, Palette } from 'lucide-react';
import { cn } from './Common';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

function GameCard({ title, description, icon, color, onClick }: GameCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative w-full p-6 rounded-[2.5rem] shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden",
        color
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </button>
  );
}

export function GamesView({ 
  onStartQuiz, 
  onStartImageQuiz,
  onStartColoring 
}: { 
  onStartQuiz: () => void; 
  onStartImageQuiz: () => void;
  onStartColoring: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pt-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-orange-900">Choose a Game</h2>
        <p className="text-orange-800/60 font-medium">Have fun while learning Tibetan!</p>
      </div>

      <div className="grid gap-6">
        <GameCard 
          title="Alphabet Quiz"
          description="Match the Tibetan characters with their sounds"
          icon={<BookOpen size={32} />}
          color="bg-orange-500 shadow-orange-200"
          onClick={onStartQuiz}
        />
        
        <GameCard 
          title="Image Challenge"
          description="Identify the objects and animals in Tibetan"
          icon={<ImageIcon size={32} />}
          color="bg-blue-500 shadow-blue-200"
          onClick={onStartImageQuiz}
        />

        <GameCard 
          title="Coloring Fun"
          description="Color by Tibetan character to reveal the picture"
          icon={<Palette size={32} />}
          color="bg-purple-500 shadow-purple-200"
          onClick={onStartColoring}
        />
      </div>

      <div className="bg-white/50 p-6 rounded-3xl border border-orange-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
          <Gamepad2 size={24} />
        </div>
        <div>
          <h4 className="font-bold text-orange-900">More games coming soon!</h4>
          <p className="text-orange-800/60 text-sm">Keep practicing every day.</p>
        </div>
      </div>
    </motion.div>
  );
}
