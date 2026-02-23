export interface TibetanCharacter {
  char: string;
  transliteration: string;
  exampleWord?: string;
  exampleMeaning?: string;
  category: 'consonant' | 'vowel';
}

export type AppState = 'landing' | 'home' | 'alphabet' | 'vocabulary' | 'quiz';
