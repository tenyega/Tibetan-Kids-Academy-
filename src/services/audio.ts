export async function speakTibetan(text: string, transliteration: string, localPath?: string) {
  // 1. Try local audio first (your personalized voice recordings)
  if (localPath) {
    try {
      const audio = new Audio(localPath);
      await audio.play();
      return;
    } catch (localError) {
      console.warn(`Local audio not found at ${localPath}, falling back to System TTS:`, localError);
    }
  }

  // 2. Fallback to Browser Native Speech Synthesis (No API keys needed)
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'bo'; // Tibetan
  utterance.rate = 0.8;  // slightly slower for kids
  window.speechSynthesis.speak(utterance);
}
