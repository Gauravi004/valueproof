'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'en-IN',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';

        reco.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onTranscript(transcript);
          }
          setIsListening(false);
        };

        reco.onerror = () => {
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      } else {
        setIsSupported(false);
      }
    }
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Browser speech recognition is not supported in this browser. Please enter text details manually.');
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
        isListening
          ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse'
          : isSupported
          ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
          : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
      }`}
      title={isSupported ? 'Speak property details (e.g. 1800 sqft house in Rajpura corner plot)' : 'Speech input not supported in this browser'}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 text-rose-400" />
          <span>Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <span>Voice Input</span>
        </>
      )}
    </button>
  );
};
