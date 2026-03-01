import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all relative",
        active ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-orange-50 rounded-2xl -z-10"
        />
      )}
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

export function FilterTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap",
        active ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-white text-orange-800/40 border border-orange-100 hover:border-orange-200"
      )}
    >
      {label}
    </button>
  );
}

export function FeatureCard({ icon, title, description, color }: { icon: React.ReactElement; title: string; description: string; color: string }) {
  return (
    <div className="space-y-4">
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner", color)}>
        {React.cloneElement(icon, { size: 32 } as any)}
      </div>
      <h3 className="text-2xl font-black text-orange-900">{title}</h3>
      <p className="text-orange-800/60 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
