/**
 * Unlocks audio on iOS/Safari by playing a silent sound on user interaction.
 */
export function unlockAudio() {
  if ('speechSynthesis' in window) {
    // Warm up speech synthesis
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }

  // Warm up HTML5 Audio
  const audio = new Audio();
  audio.play().catch(() => {
    // This will likely fail if not called directly from a click, 
    // but the attempt helps "prime" the audio context.
  });
}

export async function speakTibetan(text: string, transliteration: string, localPath?: string) {
  // Stop any current speech synthesis to avoid overlapping
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // 1. Try local audio first
  if (localPath) {
    const audio = new Audio();
    audio.src = localPath;
    audio.load();
    
    try {
      await audio.play();
      return;
    } catch (localError) {
      console.warn(`Local audio failed at ${localPath}, falling back to System TTS:`, localError);
    }
  }

  // 2. Fallback to Browser Native Speech Synthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // On some browsers, voices are loaded asynchronously
    const voices = window.speechSynthesis.getVoices();
    const tibetanVoice = voices.find(v => v.lang.toLowerCase().includes('bo'));
    
    if (tibetanVoice) {
      utterance.voice = tibetanVoice;
    }
    
    utterance.lang = 'bo'; 
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis not supported in this browser.");
  }
}
