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

export type AppState = 'landing' | 'home' | 'alphabet' | 'vocabulary' | 'quiz';
