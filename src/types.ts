export interface TibetanCharacter {
  char: string;
  transliteration: string;
  exampleWord?: string;
  exampleMeaning?: string;
  exampleMeaningFr?: string;
  category: 'consonant' | 'vowel';
  audioPath?: string;
  exampleAudioPath?: string;
  imagePath?: string;
}

export interface TibetanNumber {
  digit: string;
  tibetan: string;
  transliteration: string;
  value: number;
}

export type AppState = 'landing' | 'home' | 'alphabet' | 'vocabulary' | 'quiz' | 'games' | 'imageQuiz' | 'coloring' | 'matching' | 'numbers' | 'mathBalloon';
