export interface TibetanCharacter {
  char: string;
  transliteration: string;
  exampleWord?: string;
  exampleMeaning?: string;
  category: 'consonant' | 'vowel';
}

export type AppState = 'home' | 'alphabet' | 'vocabulary' | 'quiz';
