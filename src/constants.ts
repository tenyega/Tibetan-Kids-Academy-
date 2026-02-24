import { TibetanCharacter } from './types';

export const TIBETAN_ALPHABET: TibetanCharacter[] = [
  // Consonants
  { char: 'ཀ', transliteration: 'ka', exampleWord: 'ཀ་བ་', exampleMeaning: 'Pillar', exampleMeaningFr: 'Poteau', category: 'consonant', audioPath: '/audio/ka.mp3', exampleAudioPath: '/audio/ka_pillar.mp3', imagePath: '../public/images/ka_pillar.png' },
  { char: 'ཁ', transliteration: 'kha', exampleWord: 'ཁ་', exampleMeaning: 'Mouth', exampleMeaningFr: 'Bouche', category: 'consonant', audioPath: '/audio/kha.mp3', exampleAudioPath: '/audio/kha_mouth.mp3', imagePath: '../public/images/kha_mouth.png' },
  { char: 'ག', transliteration: 'ga', exampleWord: 'གངས་', exampleMeaning: 'Snow', exampleMeaningFr: 'Neige', category: 'consonant', audioPath: '/audio/ga.mp3', exampleAudioPath: '/audio/ga_snow.mp3', imagePath: '../public/images/ga_snow.png' },
  { char: 'ང', transliteration: 'nga', exampleWord: 'ང་', exampleMeaning: 'I / Me', exampleMeaningFr: 'Je / Moi', category: 'consonant', audioPath: '/audio/nga.mp3', exampleAudioPath: '/audio/nga_i.mp3', imagePath: '../public/images/nga_i.png' },
  
  { char: 'ཅ', transliteration: 'ca', exampleWord: 'ཅོག་ཙེ་', exampleMeaning: 'Table', exampleMeaningFr: 'Table', category: 'consonant', audioPath: '/audio/ca.mp3', exampleAudioPath: '/audio/ca_table.mp3', imagePath: '../public/images/ca_table.png' },
  { char: 'ཆ', transliteration: 'cha', exampleWord: 'ཆུ་', exampleMeaning: 'Water', exampleMeaningFr: 'Eau', category: 'consonant', audioPath: '/audio/cha.mp3', exampleAudioPath: '/audio/cha_water.mp3', imagePath: '../public/images/cha_water.png' },
  { char: 'ཇ', transliteration: 'ja', exampleWord: 'ཇ་', exampleMeaning: 'Tea', exampleMeaningFr: 'Thé', category: 'consonant', audioPath: '/audio/ja.mp3', exampleAudioPath: '/audio/ja_tea.mp3', imagePath: '../public/images/ja_tea.png' },
  { char: 'ཉ', transliteration: 'nya', exampleWord: 'ཉ་', exampleMeaning: 'Fish', exampleMeaningFr: 'Poisson', category: 'consonant', audioPath: '/audio/nya.mp3', exampleAudioPath: '/audio/nya_fish.mp3', imagePath: '../public/images/nya_fish.png' },
  
  { char: 'ཏ', transliteration: 'ta', exampleWord: 'ཏོག་', exampleMeaning: 'Top', exampleMeaningFr: 'Sommet', category: 'consonant', audioPath: '/audio/ta.mp3', exampleAudioPath: '/audio/ta_top.mp3', imagePath: '../public/images/ta_top.png' },
  { char: 'ཐ', transliteration: 'tha', exampleWord: 'ཐག་པ་', exampleMeaning: 'Rope', exampleMeaningFr: 'Corde', category: 'consonant', audioPath: '/audio/tha.mp3', exampleAudioPath: '/audio/tha_rope.mp3', imagePath: '../public/images/tha_rope.png' },
  { char: 'ད', transliteration: 'da', exampleWord: 'དེབ་', exampleMeaning: 'Book', exampleMeaningFr: 'Livre', category: 'consonant', audioPath: '/audio/da.mp3', exampleAudioPath: '/audio/da_book.mp3', imagePath: '../public/images/da_book.png' },
  { char: 'ན', transliteration: 'na', exampleWord: 'ནམ་མཁའ་', exampleMeaning: 'Sky', exampleMeaningFr: 'Ciel', category: 'consonant', audioPath: '/audio/na.mp3', exampleAudioPath: '/audio/na_sky.mp3', imagePath: '../public/images/na_sky.png' },
  
  { char: 'པ', transliteration: 'pa', exampleWord: 'པ་ལགས་', exampleMeaning: 'Father', exampleMeaningFr: 'Père', category: 'consonant', audioPath: '/audio/pa.mp3', exampleAudioPath: '/audio/pa_father.mp3', imagePath: '../public/images/pa_father.png' },
  { char: 'ཕ', transliteration: 'pha', exampleWord: 'ཕ་ལམ་', exampleMeaning: 'Diamond', exampleMeaningFr: 'Diamant', category: 'consonant', audioPath: '/audio/pha.mp3', exampleAudioPath: '/audio/pha_diamond.mp3', imagePath: '../public/images/pha_diamond.png' },
  { char: 'བ', transliteration: 'ba', exampleWord: 'བུ་', exampleMeaning: 'Boy', exampleMeaningFr: 'Garçon', category: 'consonant', audioPath: '/audio/ba.mp3', exampleAudioPath: '/audio/ba_boy.mp3', imagePath: '../public/images/ba_boy.png' },
  { char: 'མ', transliteration: 'ma', exampleWord: 'མ་མ་', exampleMeaning: 'Nanny', exampleMeaningFr: 'Nourrice', category: 'consonant', audioPath: '/audio/ma.mp3', exampleAudioPath: '/audio/ma_nanny.mp3', imagePath: '../public/images/ma_nanny.png' },
  
  { char: 'ཙ', transliteration: 'tsa', exampleWord: 'ཙི་ཙི་', exampleMeaning: 'Mouse', exampleMeaningFr: 'Souris', category: 'consonant', audioPath: '/audio/tsa.mp3', exampleAudioPath: '/audio/tsa_mouse.mp3', imagePath: '../public/images/tsa_mouse.png' },
  { char: 'ཚ', transliteration: 'tsha', exampleWord: 'ཚལ་', exampleMeaning: 'Vegetable', exampleMeaningFr: 'Légume', category: 'consonant', audioPath: '/audio/tsha.mp3', exampleAudioPath: '/audio/tsha_veg.mp3', imagePath: '../public/images/tsha_veg.png' },
  { char: 'ཛ', transliteration: 'dza', exampleWord: 'ཛ་དྲག་', exampleMeaning: 'Urgent', exampleMeaningFr: 'Urgent', category: 'consonant', audioPath: '/audio/dza.mp3', exampleAudioPath: '/audio/dza_urgent.mp3', imagePath: 'https://loremflickr.com/400/300/urgent,siren' },
  { char: 'ཝ', transliteration: 'wa', exampleWord: 'ཝ་མོ', exampleMeaning: 'Fox', exampleMeaningFr: 'Renard', category: 'consonant', audioPath: '/audio/wa.mp3', exampleAudioPath: '/audio/wa_fox.mp3', imagePath: '../public/images/wa_fox.png' },
  
  { char: 'ཞ', transliteration: 'zha', exampleWord: 'ཞྭ་མོ་', exampleMeaning: 'Hat', exampleMeaningFr: 'Chapeau', category: 'consonant', audioPath: '/audio/zha.mp3', exampleAudioPath: '/audio/zha_hat.mp3', imagePath: '../public/images/zha_hat.png' },
  { char: 'ཟ', transliteration: 'za', exampleWord: 'ཟ་མ་', exampleMeaning: 'Food', exampleMeaningFr: 'Nourriture', category: 'consonant', audioPath: '/audio/za.mp3', exampleAudioPath: '/audio/za_food.mp3', imagePath: '../public/images/za_food.png' },
  { char: 'འ', transliteration: 'a', exampleWord: 'འོད་', exampleMeaning: 'Light', exampleMeaningFr: 'Lumière', category: 'consonant', audioPath: '/audio/a_low.mp3', exampleAudioPath: '/audio/a_light.mp3', imagePath: '../public/images/a_light.png' },
  { char: 'ཡ', transliteration: 'ya', exampleWord: 'ཡི་གེ་', exampleMeaning: 'Letter', exampleMeaningFr: 'Lettre', category: 'consonant', audioPath: '/audio/ya.mp3', exampleAudioPath: '/audio/ya_letter.mp3', imagePath: '../public/images/ya_letter.png' },
  
  { char: 'ར', transliteration: 'ra', exampleWord: 'རི་', exampleMeaning: 'Mountain', exampleMeaningFr: 'Montagne', category: 'consonant', audioPath: '/audio/ra.mp3', exampleAudioPath: '/audio/ra_mountain.mp3', imagePath: '../public/images/ra_mountain.png' },
  { char: 'ལ', transliteration: 'la', exampleWord: 'ལག་པ་', exampleMeaning: 'Hand', exampleMeaningFr: 'Main', category: 'consonant', audioPath: '/audio/la.mp3', exampleAudioPath: '/audio/la_hand.mp3', imagePath: '../public/images/la_hand.png' },
  { char: 'ཤ', transliteration: 'sha', exampleWord: 'ཤ་བ་', exampleMeaning: 'Deer', exampleMeaningFr: 'Cerf', category: 'consonant', audioPath: '/audio/sha.mp3', exampleAudioPath: '/audio/sha_deer.mp3', imagePath: '../public/images/sha_deer.png' },
  { char: 'ས', transliteration: 'sa', exampleWord: 'སེང་གེ་', exampleMeaning: 'Lion', exampleMeaningFr: 'Lion', category: 'consonant', audioPath: '/audio/sa.mp3', exampleAudioPath: '/audio/sa_lion.mp3', imagePath: '../public/images/sa_lion.png' },
  
  { char: 'ཧ', transliteration: 'ha', exampleWord: 'ལྷམ་', exampleMeaning: 'Shoe', exampleMeaningFr: 'Chaussure', category: 'consonant', audioPath: '/audio/ha.mp3', exampleAudioPath: '/audio/ha_shoe.mp3', imagePath: '../public/images/ha_shoe.png' },
  { char: 'ཨ', transliteration: 'a', exampleWord: 'ཨ་མ་', exampleMeaning: 'Mother', exampleMeaningFr: 'Mère', category: 'consonant', audioPath: '/audio/a.mp3', exampleAudioPath: '/audio/a_mother.mp3', imagePath: '../public/images/a_mother.png' },

  // Vowels
  { char: 'ཨི་', transliteration: 'i', category: 'vowel', audioPath: '/audio/vowel_i.mp3' },
  { char: 'ཨུ་', transliteration: 'u', category: 'vowel', audioPath: '/audio/vowel_u.mp3' },
  { char: 'ཨེ་', transliteration: 'e', category: 'vowel', audioPath: '/audio/vowel_e.mp3' },
  { char: 'ཨོ་', transliteration: 'o', category: 'vowel', audioPath: '/audio/vowel_o.mp3' },
];
