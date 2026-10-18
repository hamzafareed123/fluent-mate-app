import * as Speech from 'expo-speech';

export async function speakEnglish(text: string): Promise<void> {
  if (!text.trim()) return;
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: 'en-US',
      onDone: () => resolve(),
      onError: (e) => reject(e),
    });
  });
}

export function stopSpeaking() {
  Speech.stop();
}
