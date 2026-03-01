import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIBETAN_ALPHABET } from '../constants';
import { cn } from './Common';
import { ChevronLeft, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function QuizView({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
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
    if (selectedOption) return;

    setSelectedOption(option);
    const correct = option === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff7e33', '#22c55e', '#3b82f6', '#eab308']
      });
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
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
          Back to Games
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pt-4"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-orange-100 rounded-full text-orange-900 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-orange-800/40 uppercase tracking-widest">Alphabet Quiz {currentQuestion + 1}/10</span>
          <div className="flex gap-1 mt-1">
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

        <motion.div 
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full text-orange-700 font-bold"
        >
          <Star size={16} className="fill-orange-500 text-orange-500" />
          <span>{score}</span>
        </motion.div>
      </div>

      <motion.div 
        animate={isCorrect ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : {}}
        className={cn(
          "bg-white p-12 rounded-[3rem] shadow-xl shadow-orange-100 border border-orange-50 flex items-center justify-center text-8xl font-bold transition-colors duration-300",
          isCorrect === true ? "text-green-600 border-green-200" : isCorrect === false ? "text-red-600 border-red-200" : "text-orange-900"
        )}
      >
        {q.char}
      </motion.div>

      <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedOption && (
            <motion.div
              key={isCorrect ? 'correct' : 'wrong'}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              className={cn(
                "flex items-center gap-2 font-black text-2xl",
                isCorrect ? "text-green-500" : "text-red-500"
              )}
            >
              {isCorrect ? (
                <>
                  <Sparkles className="animate-pulse" />
                  <span>Brilliant!</span>
                  <Sparkles className="animate-pulse" />
                </>
              ) : (
                <span>Oops!</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={!!selectedOption}
            className={cn(
              "p-6 rounded-3xl border-2 transition-all font-bold text-xl active:scale-95",
              selectedOption === opt 
                ? (isCorrect ? "bg-green-500 border-green-600 text-white" : "bg-red-500 border-red-600 text-white")
                : (selectedOption && opt === q.correct ? "bg-green-500 border-green-600 text-white" : "bg-white border-orange-100 text-orange-900 hover:border-orange-500 hover:bg-orange-50")
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
