let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export function unlockAudioOnIOS() {
  try {
    const ctx = getAudioContext();
    // Play a silent buffer — this fully unlocks iOS audio
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (e) {
    console.warn('Audio unlock failed:', e);
  }
}

export async function speakTibetan(
  text: string,
  transliteration: string,
  localPath?: string
) {
  if (localPath) {
    const success = await playWithAudioContext(localPath);
    if (success) return;
    console.warn(`AudioContext failed for ${localPath}, trying HTMLAudio...`);

    const success2 = await playWithHTMLAudio(localPath);
    if (success2) return;
    console.warn(`HTMLAudio also failed, falling back to TTS`);
  }

  speakWithTTS(text);
}

async function playWithAudioContext(path: string): Promise<boolean> {
  try {
    const ctx = getAudioContext();

    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    return new Promise((resolve) => {
      source.onended = () => resolve(true);
      source.start(0);
    });
  } catch (e) {
    console.error('AudioContext playback error:', e);
    return false;
  }
}

async function playWithHTMLAudio(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.preload = 'auto';

    audio.addEventListener('ended', () => resolve(true));
    audio.addEventListener('error', () => resolve(false));

    audio.src = path;
    audio.load();

    audio.play()
      .then(() => {})
      .catch(() => resolve(false));
  });
}

function speakWithTTS(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'bo';
  utterance.rate = 0.8;
  setTimeout(() => window.speechSynthesis.speak(utterance), 100);
}