// Web Speech API Text-to-Speech Helper for Vernacular Valuation Readouts

export const speakValuationSummary = (
  text: string,
  lang: string = 'hi-IN',
  onEnd?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this browser.');
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' || lang === 'hi-IN' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Measured pace for clarity
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) =>
        v.lang.includes('hi') ||
        v.lang.includes('IN') ||
        v.name.includes('India') ||
        v.name.includes('Hindi')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
