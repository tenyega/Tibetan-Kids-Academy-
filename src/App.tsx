/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  Home, 
  Volume2, 
  ChevronLeft, 
  Star,
  Trophy,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Heart,
  Download
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TIBETAN_ALPHABET } from './constants';
import { AppState, TibetanCharacter } from './types';
import { speakTibetan } from './services/audio';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [view, setView] = useState<AppState>('landing');
  const [selectedChar, setSelectedChar] = useState<TibetanCharacter | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback for iOS or browsers that don't support the prompt API
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install on iOS:\n1. Tap the 'Share' button (square with arrow)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add'");
      } else {
        alert("To install:\n1. Look for the 'Install' icon in your browser's address bar\n2. Or tap the browser menu (three dots) and select 'Install app' or 'Add to Home screen'");
      }
    }
  };

  const isLanding = view === 'landing';

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#4A4A4A] font-sans selection:bg-orange-100">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 border-8 border-orange-400 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border-8 border-blue-400 rounded-3xl rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-8 border-green-400 rounded-full" />
      </div>

      <div className={cn("relative z-10 mx-auto min-h-screen flex flex-col", isLanding ? "max-w-none" : "max-w-lg")}>
        {/* Header - Hidden on Landing */}
        {!isLanding && (
          <header className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <GraduationCap size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-orange-900">Tibetan Kids</h1>
            </div>
            {view !== 'home' && (
              <button 
                onClick={() => setView('home')}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <Home size={24} />
              </button>
            )}
          </header>
        )}

        {/* Main Content */}
        <main className={cn("flex-1", isLanding ? "" : "px-6 pb-24")}>
          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <LandingView 
                key="landing"
                onStart={() => setView('home')} 
                onInstall={handleInstall}
              />
            )}
            {view === 'home' && <HomeView onStart={() => setView('alphabet')} onQuiz={() => setView('quiz')} />}
            {view === 'alphabet' && (
              <AlphabetView 
                onBack={() => setView('home')} 
                onSelect={setSelectedChar} 
              />
            )}
            {view === 'quiz' && <QuizView onBack={() => setView('home')} />}
          </AnimatePresence>
        </main>

        {/* Character Detail Modal */}
        <AnimatePresence>
          {selectedChar && (
            <CharacterModal 
              char={selectedChar} 
              onClose={() => setSelectedChar(null)} 
            />
          )}
        </AnimatePresence>

        {/* Bottom Navigation - Hidden on Landing */}
        {!isLanding && (
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 flex items-center justify-around">
            <NavButton 
              active={view === 'home'} 
              onClick={() => setView('home')} 
              icon={<Home size={20} />} 
              label="Home" 
            />
            <NavButton 
              active={view === 'alphabet'} 
              onClick={() => setView('alphabet')} 
              icon={<BookOpen size={20} />} 
              label="Learn" 
            />
            <NavButton 
              active={view === 'quiz'} 
              onClick={() => setView('quiz')} 
              icon={<Gamepad2 size={20} />} 
              label="Play" 
            />
          </nav>
        )}
      </div>
    </div>
  );
}

function LandingView({ onStart, onInstall }: { onStart: () => void; onInstall: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#fefce8] to-[#fef9c3] relative z-50"
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
          <div className="text-sm text-orange-800/50 font-medium bg-white/50 p-6 rounded-2xl border border-orange-100 text-left">
            <p className="mb-2">⚠️ <b>Installation:</b></p>
            <p className="mb-1"><b>Android:</b> Sélectionnez <b>"Installer l'application"</b> ou <b>"Ajouter à l'écran d'accueil"</b>.</p>
            <p className="mb-1"><b>iOS:</b> Appuyez sur le bouton <b>Partager</b> et sélectionnez <b>"Sur l'écran d'accueil"</b>.</p>
            <hr className="my-3 border-orange-100" />
            <p className="mb-2">🔊 <b>Audio (iPhone):</b> Assurez-vous que le bouton <b>Silencieux</b> sur le côté de votre iPhone est <b>DÉSACTIVÉ</b>.</p>
            <hr className="my-3 border-orange-100" />
            <p>📧 Need help? <a href="mailto:support@tibetan-kids.edu" className="text-orange-600 hover:underline">support@tibetan-kids.edu</a></p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactElement; title: string; description: string; color: string }) {
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

function HomeView({ onStart, onQuiz }: { onStart: () => void; onQuiz: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pt-8"
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
        <p className="text-orange-800/60 font-medium">Ready to learn the beautiful Tibetan language?</p>
      </div>

      <div className="grid gap-4">
        <button 
          onClick={onStart}
          className="group relative bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-3xl shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <BookOpen size={80} />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Start Learning</h3>
            <p className="text-white/80 text-sm">Learn the alphabet and words</p>
          </div>
        </button>

        <button 
          onClick={onQuiz}
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-3xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4 text-left overflow-hidden"
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

function AlphabetView({ onBack, onSelect }: { onBack: () => void; onSelect: (c: TibetanCharacter) => void }) {
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

function QuizView({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Simple quiz logic: Match char to transliteration
  const questions = React.useMemo(() => {
    return [...TIBETAN_ALPHABET]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(q => {
        const options = [q.transliteration];
        while (options.length < 4) {
          const random = TIBETAN_ALPHABET[Math.floor(Math.random() * TIBETAN_ALPHABET.length)].transliteration;
          if (!options.includes(random)) options.push(random);
        }
        return {
          char: q.char,
          correct: q.transliteration,
          options: options.sort(() => Math.random() - 0.5)
        };
      });
  }, []);

  const handleAnswer = (option: string) => {
    if (option === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 pt-12"
      >
        <div className="relative inline-block">
          <div className="w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center text-7xl">
            🏆
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-orange-900">Amazing!</h2>
          <p className="text-xl text-orange-800/60 font-medium">You scored {score} out of {questions.length}</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full bg-orange-500 text-white p-5 rounded-3xl font-bold text-lg shadow-xl shadow-orange-200 hover:bg-orange-600 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pt-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-orange-800/40 uppercase tracking-widest">Question {currentQuestion + 1}/10</span>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-2 h-2 rounded-full",
                i < currentQuestion ? "bg-green-500" : i === currentQuestion ? "bg-orange-500" : "bg-orange-100"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-orange-100 border border-orange-50 flex items-center justify-center text-8xl font-bold text-orange-900">
        {q.char}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="bg-white p-6 rounded-3xl border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50 transition-all font-bold text-xl text-orange-900 active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function CharacterModal({ char, onClose }: { char: TibetanCharacter; onClose: () => void }) {
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

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
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

function FilterTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
