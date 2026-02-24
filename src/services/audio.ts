/**
 * Unlocks audio on iOS/Safari by playing a silent sound and resuming the audio context.
 */
export function unlockAudio() {
  // 1. Warm up Speech Synthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }

  // 2. Warm up HTML5 Audio
  const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
  silentAudio.play().catch(() => {});

  // 3. Resume AudioContext if it exists
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (AudioContextClass) {
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }
}

export async function speakTibetan(text: string, transliteration: string, localPath?: string) {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // 1. Try local audio first
  if (localPath) {
    try {
      const audio = new Audio(localPath);
      // On iOS, we need to call play() immediately in the same tick if possible
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        return;
      }
    } catch (localError) {
      console.warn(`Local audio failed at ${localPath}:`, localError);
    }
  }

  // 2. Fallback to Browser Native Speech Synthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Force a small delay to ensure iOS picks up the "user interaction" context if called from a button
    const voices = window.speechSynthesis.getVoices();
    const tibetanVoice = voices.find(v => v.lang.toLowerCase().includes('bo'));
    
    if (tibetanVoice) {
      utterance.voice = tibetanVoice;
    }
    
    utterance.lang = 'bo-CN'; 
    utterance.rate = 0.7;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
}
