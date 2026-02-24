// At the top of audio.ts, export this:
export function unlockAudioOnIOS() {
  try {
    getAudioContext();
  } catch (e) { /* ignore */ }
}

// Keep a single shared AudioContext, created on first user gesture
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // iOS suspends AudioContext until a gesture — resume it
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export async function speakTibetan(
  text: string,
  transliteration: string,
  localPath?: string
) {
  // 1. Try local audio file first
  if (localPath) {
    const success = await playAudioFile(localPath);
    if (success) return;
    console.warn(`Local audio failed at ${localPath}, falling back to TTS`);
  }

  // 2. Fallback: Browser TTS (limited on iOS PWA, but worth trying)
  speakWithTTS(text);
}

async function playAudioFile(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Ensure AudioContext is unlocked (critical for iOS)
    try {
      getAudioContext();
    } catch (e) {
      // ignore — we'll still try HTMLAudio
    }

    const audio = new Audio();
    audio.preload = 'auto';

    // Must set these for iOS
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');

    const cleanup = () => {
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
    };

    const onEnd = () => { cleanup(); resolve(true); };
    const onError = (e: Event) => {
      cleanup();
      console.error('Audio error:', e);
      resolve(false);
    };

    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);

    audio.src = path;
    audio.load();

    // play() returns a Promise — MUST handle rejection
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playing successfully — wait for 'ended' event
        })
        .catch((err) => {
          console.error('play() rejected:', err);
          cleanup();
          resolve(false);
        });
    }
  });
}

function speakWithTTS(text: string) {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'bo';
  utterance.rate = 0.8;

  // iOS sometimes needs a tiny delay after cancel()
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 100);
}