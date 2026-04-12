import React, { useState } from 'react';
import { useSpeechRecognition, useTextToSpeech, useVoiceInput } from '../hooks/useSpeech';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceChatWidgetProps {
  initialMessages?: ChatMessage[];
}

export default function VoiceChatWidget({ initialMessages = [] }: VoiceChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const { isListening, transcript, startListening, stopListening } = useVoiceInput((text) => {
    handleSend(text);
  });
  const { speak, isSpeaking } = useTextToSpeech();

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `You said: "${text}". This is a demo response showing voice input integration.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      speak(botMsg.content);
    }, 500);
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-bold">Voice Chat</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500' : 'bg-[#0082D8]/20 text-[#0082D8]'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          {isSpeaking && <span className="text-white/40 text-xs">Speaking...</span>}
        </div>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-white/40 py-8">
            Press the microphone and speak, or type a message
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-[#0082D8]/20 text-white' : 'bg-white/10 text-white'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isListening && (
          <div className="text-center text-[#0082D8] text-sm animate-pulse">Listening: {transcript}</div>
        )}
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
          placeholder="Type or speak..."
          className="flex-1 bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#0082D8]"
        />
        <button onClick={() => handleSend(inputText)} className="bg-[#0082D8] hover:bg-[#0082D8]/80 text-white px-4 py-2 rounded-lg transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}