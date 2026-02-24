export async function speakTibetan(text: string, transliteration: string, localPath?: string) {
  // Stop any current speech synthesis to avoid overlapping
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // 1. Try local audio first
  if (localPath) {
    const audio = new Audio();
    audio.src = localPath;
    audio.load(); // Explicitly load the audio
    
    try {
      // On iOS, we must call .play() as directly as possible
      await audio.play();
      return;
    } catch (localError) {
      console.warn(`Local audio failed at ${localPath}, falling back to System TTS:`, localError);
    }
  }

  // 2. Fallback to Browser Native Speech Synthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Tibetan voice, otherwise it uses system default
    utterance.lang = 'bo-CN'; // More specific Tibetan code
    utterance.rate = 0.7;     // Slightly slower for children
    utterance.pitch = 1.1;    // Slightly higher for a "kid-friendly" tone
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis not supported in this browser.");
  }
}
