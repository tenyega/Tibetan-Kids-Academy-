export async function speakTibetan(text: string, transliteration: string) {
  const utterance = new SpeechSynthesisUtterance(transliteration);
  utterance.lang = 'bo'; // Tibetan
  utterance.rate = 0.8;  // slightly slower for kids
  window.speechSynthesis.speak(utterance);
}