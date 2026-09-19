import { useState, useEffect, useRef, useCallback } from 'react';
import type { PropertyInputState } from '../types/valuation';

interface ExtractedVoiceData extends Partial<PropertyInputState> {
  rawTranscript: string;
}

const SPEECH_RECOGNITION_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

export const useVoiceInput = (currentLanguage: string = 'hi') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedVoiceData | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  const parseVoiceTranscript = useCallback((text: string): ExtractedVoiceData => {
    const lower = text.toLowerCase();
    const result: ExtractedVoiceData = {
      rawTranscript: text,
    };

    const knownLocations = [
      'alwar', 'jhansi', 'karnal', 'meerut', 'kolhapur', 'salem', 'guntur', 'bathinda',
      'patiala', 'siliguri', 'morbi', 'nashik', 'amritsar', 'panipat', 'rohtak', 'solapur',
      'durgapur', 'anand', 'bharuch', 'tirupati', 'warangal', 'sonipat', 'mathura', 'bareilly'
    ];
    for (const loc of knownLocations) {
      if (lower.includes(loc)) {
        result.location = loc.charAt(0).toUpperCase() + loc.slice(1);
        break;
      }
    }

    if (lower.includes('plot') || lower.includes('zameen') || lower.includes('zamin') || lower.includes('जमीन') || lower.includes('प्लॉट')) {
      result.propertyType = 'plot';
    } else if (lower.includes('shop') || lower.includes('dukaan') || lower.includes('dukan') || lower.includes('commercial') || lower.includes('दुकान')) {
      result.propertyType = 'shop';
    } else if (lower.includes('flat') || lower.includes('apartment') || lower.includes('society') || lower.includes('फ्लैट')) {
      result.propertyType = 'apartment';
    } else if (lower.includes('house') || lower.includes('makan') || lower.includes('kothi') || lower.includes('ghar') || lower.includes('home') || lower.includes('मकान') || lower.includes('कोठी')) {
      result.propertyType = 'house';
    }

    const gajMatch = lower.match(/(\d+)\s*(gaj|gaz|gajj|sq\s*yard|square\s*yard|गज)/);
    const sqftMatch = lower.match(/(\d+)\s*(sqft|sq\s*ft|square\s*feet|square\s*foot|varg\s*feet|वर्ग\s*फीट)/);
    const gunthaMatch = lower.match(/(\d+)\s*(guntha|gunthe|गुंठा)/);
    const bighaMatch = lower.match(/(\d+)\s*(bigha|beegha|बीघा)/);

    if (gajMatch) {
      result.area = parseInt(gajMatch[1], 10);
      result.areaUnit = 'gaj';
    } else if (sqftMatch) {
      result.area = parseInt(sqftMatch[1], 10);
      result.areaUnit = 'sqft';
    } else if (gunthaMatch) {
      result.area = parseInt(gunthaMatch[1], 10);
      result.areaUnit = 'guntha';
    } else if (bighaMatch) {
      result.area = parseInt(bighaMatch[1], 10);
      result.areaUnit = 'bigha';
    } else {
      const numMatch = lower.match(/(\d{2,5})/);
      if (numMatch) {
        result.area = parseInt(numMatch[1], 10);
        result.areaUnit = 'gaj';
      }
    }

    if (lower.includes('60 foot') || lower.includes('60 ft') || lower.includes('highway') || lower.includes('60 feet') || lower.includes('60 फीट')) {
      result.roadWidth = '60ft';
    } else if (lower.includes('40 foot') || lower.includes('40 ft') || lower.includes('40 feet') || lower.includes('main road') || lower.includes('40 फीट')) {
      result.roadWidth = '40ft';
    } else if (lower.includes('30 foot') || lower.includes('30 ft') || lower.includes('30 feet') || lower.includes('30 फीट')) {
      result.roadWidth = '30ft';
    } else if (lower.includes('20 foot') || lower.includes('20 ft') || lower.includes('20 feet') || lower.includes('20 फीट')) {
      result.roadWidth = '20ft';
    } else if (lower.includes('15 foot') || lower.includes('15 ft') || lower.includes('gali') || lower.includes('15 फीट')) {
      result.roadWidth = '15ft';
    }

    if (lower.includes('corner') || lower.includes('2 side open') || lower.includes('two side') || lower.includes('do taraf') || lower.includes('कॉर्नर') || lower.includes('दो तरफ')) {
      result.isCornerPlot = true;
    }

    const bhkMatch = lower.match(/(\d+)\s*(bhk|bedroom|kamre|kamra|bed|कमरे)/);
    if (bhkMatch) {
      result.bedrooms = parseInt(bhkMatch[1], 10);
    }

    if (lower.includes('bechna') || lower.includes('sell') || lower.includes('sale') || lower.includes('बेचना')) {
      result.intent = 'sell';
    } else if (lower.includes('khareedna') || lower.includes('buy') || lower.includes('purchase') || lower.includes('खरीदना')) {
      result.intent = 'buy';
    }

    return result;
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_RECOGNITION_LANG_MAP[currentLanguage] || 'en-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
        const parsed = parseVoiceTranscript(currentTranscript);
        setExtractedData(parsed);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [currentLanguage, parseVoiceTranscript]);

  const startListening = () => {
    setTranscript('');
    setExtractedData(null);
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(Math.random() * 0.8 + 0.2);
    }, 150);
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
    }
    setAudioLevel(0);
  };

  const simulateVoiceInput = (sampleText?: string) => {
    const sample =
      sampleText ||
      'Mera 150 gaj ka corner plot hai Alwar bypass road par 30 foot road ke sath mujhe bechna hai';
    setTranscript(sample);
    const parsed = parseVoiceTranscript(sample);
    setExtractedData(parsed);
  };

  return {
    isListening,
    transcript,
    extractedData,
    isSupported,
    audioLevel,
    startListening,
    stopListening,
    simulateVoiceInput,
  };
};
