import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { continuous = false, interimResults = true, lang = 'en-US', onResult, onEnd, onError } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
        onResult?.(finalTranscript, true);
      }
      setInterimTranscript(interim);
      onResult?.(interim, false);
    };

    recognition.onerror = (event: any) => {
      onError?.(event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [continuous, interimResults, lang, onResult, onEnd, onError]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript };
}

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  onEnd?: () => void;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { rate = 1, pitch = 1, volume = 1, voice, onEnd } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(speechSynthesis.getVoices());
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [rate, pitch, volume, voice, onEnd]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
  }, []);

  return { speak, stop, pause, resume, isSpeaking, voices };
}

export function useVoiceInput(onResult: (text: string) => void) {
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      if (isFinal) onResult(text);
    },
  });

  return { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript };
}