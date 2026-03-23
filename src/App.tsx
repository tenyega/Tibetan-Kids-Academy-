/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  Home, 
  GraduationCap
} from 'lucide-react';
import { AppState, TibetanCharacter } from './types';
import { speakTibetan, unlockAudioOnIOS } from './services/audio';
import { cn, NavButton } from './components/Common';
import { LandingView } from './components/LandingView';
import { HomeView } from './components/HomeView';
import { AlphabetView } from './components/AlphabetView';
import { QuizView } from './components/QuizView';
import { GamesView } from './components/GamesView';
import { ImageQuizView } from './components/ImageQuizView';
import { ColoringView } from './components/ColoringView';
import { MatchingView } from './components/MatchingView';
import { NumbersView } from './components/NumbersView';
import { CharacterModal } from './components/CharacterModal';

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
        <main className={cn("flex-1 flex flex-col", isLanding ? "" : "px-6 pb-24")}>
          {view === 'landing' ? (
            <LandingView 
              key="landing"
              onStart={() => {
                // unlockAudio();
                setView('home');
              }} 
              onInstall={() => {
                // unlockAudio();
                handleInstall();
              }}
            />
          ) : (
            <AnimatePresence mode="wait">
              {view === 'home' && <HomeView key="home" onStart={() => setView('alphabet')} onQuiz={() => setView('games')} onNumbers={() => setView('numbers')} />}
              {view === 'alphabet' && (
                <AlphabetView 
                  key="alphabet"
                  onBack={() => setView('home')} 
                  onSelect={setSelectedChar} 
                />
              )}
              {view === 'games' && (
                <GamesView 
                  key="games"
                  onStartQuiz={() => setView('quiz')}
                  onStartImageQuiz={() => setView('imageQuiz')}
                  onStartColoring={() => setView('coloring')}
                  onStartMatching={() => setView('matching')}
                />
              )}
              {view === 'quiz' && <QuizView key="quiz" onBack={() => setView('games')} />}
              {view === 'imageQuiz' && <ImageQuizView key="imageQuiz" onBack={() => setView('games')} />}
              {view === 'coloring' && <ColoringView key="coloring" onBack={() => setView('games')} />}
              {view === 'matching' && <MatchingView key="matching" onBack={() => setView('games')} />}
              {view === 'numbers' && <NumbersView key="numbers" onBack={() => setView('home')} />}
            </AnimatePresence>
          )}
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
              active={view === 'games' || view === 'quiz' || view === 'imageQuiz' || view === 'coloring' || view === 'matching'} 
              onClick={() => setView('games')} 
              icon={<Gamepad2 size={20} />} 
              label="Play" 
            />
          </nav>
        )}
      </div>
    </div>
  );
}
