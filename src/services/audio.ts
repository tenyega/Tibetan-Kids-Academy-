// services/audio.ts

let unlocked = false;
let sharedCtx: AudioContext | null = null;

/**
 * Reliable iOS/PWA audio unlock:
 * Call this ONLY inside a real user gesture (click/tap),
 * and also call it right before playing any sound.
 */
export async function unlockAudio() {
  if (unlocked) return;

  // 1) Resume a shared AudioContext (helps iOS)
  const AudioContextClass =
    (window as any).AudioContext || (window as any).webkitAudioContext;

  if (AudioContextClass) {
    try {
      sharedCtx = sharedCtx ?? new AudioContextClass();
      if (sharedCtx.state === "suspended") {
        await sharedCtx.resume();
      }
    } catch (e) {
      console.warn("AudioContext resume failed:", e);
    }
  }

  // 2) Warm up HTML5 Audio with a tiny silent WAV
  try {
    const silent = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
    );
    // iOS hint
    (silent as any).playsInline = true;
    silent.preload = "auto";

    await silent.play();
    silent.pause();
    silent.currentTime = 0;
  } catch (e) {
    // If this fails, iOS may still work once the user presses Listen
    console.warn("Silent audio unlock failed:", e);
  }

  unlocked = true;
}

/**
 * Ensure local paths work in production & installed PWA.
 * Best practice: keep audio in /public/audio and use "/audio/xxx.mp3"
 */
function normalizeAudioUrl(path: string): string {
  // Already absolute URL or absolute path
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;

  // If someone passes "audio/ka.mp3", make it absolute from the app origin
  return "/" + path.replace(/^\.?\//, "");
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Plays local audio with robust iOS behavior.
 */
async function playLocalAudio(url: string) {
  const audio = new Audio(url);

  // iOS hints
  (audio as any).playsInline = true;
  audio.preload = "auto";

  // Helpful debug
  audio.addEventListener("error", () => {
    console.warn("AUDIO ERROR:", audio.error, "SRC:", audio.src);
  });

  // Some iOS versions need a tiny delay after unlock
  await wait(10);

  const p = audio.play();
  if (p) await p;
}

/**
 * Fallback: SpeechSynthesis (not reliable for Tibetan on iOS).
 * We keep it, but we also detect missing voices.
 */
function speakWithTTS(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // On iOS, Tibetan voices are often missing.
  // We'll try, but if no voice is found, it may be silent.
  const voices = window.speechSynthesis.getVoices();
  const tibetanVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("bo")) ||
    voices.find((v) => v.lang?.toLowerCase().includes("bo"));

  if (tibetanVoice) utterance.voice = tibetanVoice;

  // lang hint
  utterance.lang = "bo";
  utterance.rate = 0.8;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

/**
 * Main API
 */
export async function speakTibetan(
  text: string,
  transliteration: string,
  localPath?: string
) {
  // Always unlock right before playing/speaking (iOS requirement)
  await unlockAudio();

  // Stop any previous TTS
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // 1) Prefer local audio (RECOMMENDED for iOS)
  if (localPath) {
    const url = normalizeAudioUrl(localPath);

    try {
      await playLocalAudio(url);
      return;
    } catch (e) {
      console.warn("Local audio failed:", url, e);
    }
  }

  // 2) TTS fallback (may be silent on iOS for Tibetan)
  try {
    speakWithTTS(text);
  } catch (e) {
    console.warn("TTS failed:", e);
  }
}