import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { TIBETAN_NUMBERS } from '../constants';
import { cn } from './Common';
import confetti from 'canvas-confetti';

interface MathBalloonGameProps {
  onBack: () => void;
}

interface Problem {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  options: number[];
}

export function MathBalloonGame({ onBack }: MathBalloonGameProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'won'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [balloonY, setBalloonY] = useState(0); 

  const TOTAL_QUESTIONS = 5;

  const getTibetanDigit = (val: number) => {
    const found = TIBETAN_NUMBERS.find(n => n.value === val);
    if (found) return found.digit;
    return val.toString(); 
  };

  const generateProblem = useCallback(() => {
    const operator = Math.random() > 0.5 ? '+' : '-';
    let n1, n2, ans;

    if (operator === '+') {
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
      ans = n1 + n2;
    } else {
      n1 = Math.floor(Math.random() * 10) + 10;
      n2 = Math.floor(Math.random() * 9) + 1;
      ans = n1 - n2;
    }

    const options = [ans];
    while (options.length < 4) {
      const wrong = Math.max(1, ans + (Math.floor(Math.random() * 7) - 3));
      if (!options.includes(wrong)) options.push(wrong);
    }

    setProblem({
      num1: n1,
      num2: n2,
      operator,
      answer: ans,
      options: options.sort(() => Math.random() - 0.5)
    });
    setFeedback(null);
    setBalloonY(0); 
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      generateProblem();
    }
  }, [gameState, generateProblem]);

  // Falling Animation
  useEffect(() => {
    if (gameState !== 'playing' || feedback || level === 1) return;

    const interval = setInterval(() => {
      setBalloonY(y => {
        const nextY = y + (0.2 + currentQuestion * 0.03); 
        if (nextY >= 75) { // Hit bottom danger zone
          clearInterval(interval);
          handleTimeout();
          return 75;
        }
        return nextY;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, feedback, currentQuestion, level]);

  const handleTimeout = () => {
    setFeedback('timeout');
    setLives(l => {
      const newLives = l - 1;
      if (newLives <= 0) {
        setGameState('gameOver');
      }
      return newLives;
    });
    
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS && lives > 1) {
        setCurrentQuestion(q => q + 1);
        generateProblem();
      } else if (lives <= 1) {
        setGameState('gameOver');
      } else {
        if (level === 1) {
          setLevel(2);
          setCurrentQuestion(1);
          generateProblem();
        } else {
          setGameState('won');
        }
      }
    }, 1500);
  };

  const handleAnswer = (selected: number) => {
    if (gameState !== 'playing' || feedback) return;

    if (selected === problem?.answer) {
      setFeedback('correct');
      setScore(s => s + 10);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      
      setTimeout(() => {
        if (currentQuestion < TOTAL_QUESTIONS) {
          setCurrentQuestion(q => q + 1);
          generateProblem();
        } else {
          if (level === 1) {
            setLevel(2);
            setCurrentQuestion(1);
            generateProblem();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } else {
            setGameState('won');
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        }
        return newLives;
      });
      
      setTimeout(() => {
        if (lives > 1) {
          setFeedback(null);
        } else {
          setGameState('gameOver');
        }
      }, 1000);
    }
  };

  const restart = () => {
    setScore(0);
    setLives(3);
    setCurrentQuestion(1);
    setLevel(1);
    setGameState('playing');
    setFeedback(null);
    setBalloonY(0);
  };

  if (gameState !== 'playing') {
    const isWon = gameState === 'won';
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center space-y-8 pt-12"
      >
        <div className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-inner",
          isWon ? "bg-emerald-100" : "bg-red-100"
        )}>
          {isWon ? '🏆' : '🎈'}
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-slate-900">
            {isWon ? "Amazing Job!" : "Game Over!"}
          </h2>
          <p className="text-xl text-slate-600 font-medium">
            {isWon ? `You mastered both levels!` : "Better luck next time!"}
          </p>
          <div className="bg-white px-6 py-2 rounded-2xl border-2 border-slate-100 inline-block mt-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block">Final Score</span>
            <span className="text-3xl font-black text-slate-900">{score}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={restart}
            className={cn(
              "w-full text-white p-5 rounded-3xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2",
              isWon ? "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600" : "bg-orange-500 shadow-orange-200 hover:bg-orange-600"
            )}
          >
            <RefreshCw size={20} />
            {isWon ? "Play Again" : "Try Again"}
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
      className="space-y-6 pt-4 h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tighter">Level {level}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestion}/{TOTAL_QUESTIONS}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={14} 
                className={cn(
                  "transition-all",
                  i < lives ? "fill-red-500 text-red-500" : "fill-slate-200 text-slate-200"
                )} 
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 font-bold border border-yellow-100">
          <Trophy size={16} className="fill-yellow-500 text-yellow-500" />
          <span>{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200 overflow-hidden min-h-[300px]">
        <AnimatePresence mode="wait">
          {problem && (
            <motion.div
              key={`${problem.num1}-${problem.num2}-${problem.operator}`}
              initial={{ opacity: 0, scale: 0.5, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: `${balloonY * 4}px` }}
              exit={{ opacity: 0, scale: 1.2, x: "-50%" }}
              className="absolute left-1/2 top-10 z-10"
            >
              {/* Balloon Shape */}
              <div className={cn(
                "relative w-40 h-48 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-xl flex flex-col items-center justify-center text-white border-4 transition-colors duration-300",
                feedback === 'correct' ? "bg-emerald-500 border-emerald-400" :
                feedback === 'wrong' || feedback === 'timeout' ? "bg-red-500 border-red-400" :
                "bg-emerald-500 border-emerald-400"
              )}>
                <div className="text-3xl font-black flex items-center gap-2">
                  <span>{getTibetanDigit(problem.num1)}</span>
                  <span>{problem.operator}</span>
                  <span>{getTibetanDigit(problem.num2)}</span>
                </div>
                
                {/* Balloon Knot */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-inherit rotate-45" />
                {/* String */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-300" />
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-5xl z-20 text-white"
                  >
                    {feedback === 'correct' ? <Sparkles /> : feedback === 'timeout' ? "⏰" : "❌"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Danger Zone Indicator (Only Level 2) */}
        {level === 2 && <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-400/20" />}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4 pb-8">
        {problem?.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className={cn(
              "p-5 rounded-3xl text-3xl font-black transition-all shadow-lg border-b-4",
              feedback === 'correct' && opt === problem.answer ? "bg-emerald-500 text-white border-emerald-700" :
              feedback === 'wrong' && opt !== problem.answer ? "bg-slate-100 text-slate-400 border-slate-200" :
              "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            )}
          >
            {getTibetanDigit(opt)}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
