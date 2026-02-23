import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function speakTibetan(text: string, transliteration: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say the Tibetan letter or word: "${text}". It is pronounced as "${transliteration}". Speak clearly for a child learning the language.` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      await audio.play();
    }
  } catch (error) {
    console.error("Error in speakTibetan:", error);
  }
}

function base64ToBlob(base64: string, type: string) {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type });
}
