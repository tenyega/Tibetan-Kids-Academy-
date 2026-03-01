import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIBETAN_ALPHABET } from '../constants';
import { cn } from './Common';
import { Trophy, RotateCcw, ChevronLeft, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakTibetan, unlockAudioOnIOS } from '../services/audio';

export function ImageQuizView({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);

  // Filter for characters that have an image and an example word
  const questions = React.useMemo(() => {
    const itemsWithImages = TIBETAN_ALPHABET.filter(item => item.imagePath && item.exampleWord);
    return [...itemsWithImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(q => {
        const options = [q.exampleWord!];
        while (options.length < 4) {
          const randomItem = itemsWithImages[Math.floor(Math.random() * itemsWithImages.length)];
          const randomWord = randomItem.exampleWord!;
          if (!options.includes(randomWord)) options.push(randomWord);
        }
        return {
          image: q.imagePath!,
          correct: q.exampleWord!,
          meaning: q.exampleMeaning!,
          audio: q.exampleAudioPath || q.audioPath,
          options: options.sort(() => Math.random() - 0.5)
        };
      });
  }, []);

  const playCorrectAudio = async () => {
    const q = questions[currentQuestion];
    unlockAudioOnIOS();
    await speakTibetan(q.correct, q.meaning, q.audio);
  };

  const handleAnswer = async (option: string) => {
    if (selectedOption || wrongGuesses.includes(option)) return;
    
    const q = questions[currentQuestion];
    const correct = option === q.correct;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (correct) {
      setIsCorrect(true);
      setSelectedOption(option);
      setScore(s => s + 1);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#22c55e', '#ff7e33', '#eab308']
      });
      await playCorrectAudio();
      
      setTimeout(() => {
        moveToNext();
      }, 2000);
    } else {
      if (newAttempts >= 3) {
        // Auto-select correct after 3 failed attempts
        setIsCorrect(false);
        setSelectedOption(q.correct);
        await playCorrectAudio();
        
        setTimeout(() => {
          moveToNext();
        }, 2500);
      } else {
        // Just mark as wrong and allow another try
        setWrongGuesses(prev => [...prev, option]);
      }
    }
  };

  const moveToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setAttempts(0);
      setWrongGuesses([]);
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
          <h2 className="text-4xl font-black text-orange-900">Great Job!</h2>
          <p className="text-xl text-orange-800/60 font-medium">You identified {score} out of {questions.length} items!</p>
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

  if (questions.length === 0) {
    return (
      <div className="text-center p-12 space-y-4">
        <p className="text-orange-800/60">Not enough images for the quiz yet!</p>
        <button onClick={onBack} className="text-orange-500 font-bold">Go Back</button>
      </div>
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
          <span className="text-xs font-bold text-orange-800/40 uppercase tracking-widest">Image Quiz {currentQuestion + 1}/10</span>
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

      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-bold text-orange-500 uppercase">Attempts: {attempts}/3</span>
      </div>

      <motion.div 
        animate={isCorrect ? { scale: [1, 1.05, 1] } : {}}
        className={cn(
          "bg-white p-4 rounded-[3rem] shadow-xl shadow-orange-100 border-4 flex flex-col items-center justify-center overflow-hidden transition-colors duration-300",
          isCorrect === true ? "border-green-400" : isCorrect === false ? "border-blue-400" : "border-orange-50"
        )}
      >
        <div className="w-full aspect-video rounded-[2rem] overflow-hidden bg-orange-50">
          <img 
            src={q.image} 
            alt="Quiz item" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt) => {
          const isWrongGuess = wrongGuesses.includes(opt);
          const isSelected = selectedOption === opt;
          const isCorrectAnswer = opt === q.correct;

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={!!selectedOption || isWrongGuess}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all font-bold text-2xl active:scale-95",
                isSelected
                  ? (isCorrect ? "bg-green-500 border-green-600 text-white" : "bg-blue-500 border-blue-600 text-white")
                  : (isWrongGuess 
                      ? "bg-red-50 border-red-100 text-red-300 scale-95 opacity-50" 
                      : (selectedOption && isCorrectAnswer ? "bg-green-500 border-green-600 text-white" : "bg-white border-orange-100 text-orange-900 hover:border-orange-500 hover:bg-orange-50"))
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      
      <div className="h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedOption ? (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -10 }}
              className="text-center"
            >
              <div className={cn(
                "flex items-center justify-center gap-2 font-black text-2xl mb-1",
                isCorrect ? "text-green-500" : "text-blue-500"
              )}>
                {isCorrect && <Sparkles className="animate-pulse" />}
                <span>{isCorrect ? "Brilliant! 🎉" : "Time to learn! 📚"}</span>
                {isCorrect && <Sparkles className="animate-pulse" />}
              </div>
              <p className="text-orange-800/60 font-medium">{q.correct} means "{q.meaning}"</p>
            </motion.div>
          ) : attempts > 0 && (
            <motion.div 
              key="retry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-500 font-bold"
            >
              <RotateCcw size={16} />
              <span>Not quite! Try again ({3 - attempts} left)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
