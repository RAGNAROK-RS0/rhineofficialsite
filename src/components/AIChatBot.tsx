import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2, Maximize2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBotProps {
  position?: 'bottom-right' | 'bottom-left';
  accentColor?: string;
}

const defaultResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm Rhine AI. How can I help you today?",
    "Hi there! Welcome to Rhine Solution. What can I assist you with?",
    "Hey! I'm here to help. What would you like to know about our services?",
  ],
  services: [
    "We offer a comprehensive range of services:\n\n• **Web Development** - Modern React/TypeScript applications\n• **Cloud Infrastructure** - AWS, GCP, Azure solutions\n• **AI & Automation** - Intelligent workflows and ML\n• **Cybersecurity** - Enterprise-grade protection\n• **Enterprise Software** - Custom business solutions",
  ],
  webgpu: [
    "Our WebGPU 3D rendering uses cutting-edge browser technology for:\n\n• High-performance particle systems\n• Real-time 3D visualizations\n• GPU-accelerated effects\n• Progressive enhancement for all devices",
  ],
  pricing: [
    "We have flexible pricing tiers:\n\n• **Starter** - Free (basic features)\n• **Professional** - $29/month (full features)\n• **Enterprise** - $99/month (custom solutions)\n\nVisit /pricing for details!",
  ],
  contact: [
    "You can reach us at:\n\n• **Email**: hello@rhinesolution.com\n• **Phone**: Available on request\n• **Form**: /contact\n\nWe're happy to discuss your project!",
  ],
  portfolio: [
    "Check out our portfolio at /portfolio to see our recent work including:\n\n• Web applications\n• Cloud solutions\n• AI integrations\n• Enterprise systems",
  ],
  default: [
    "Thanks for your message! I'd recommend visiting our /services page or /contact to get more specific help.",
    "That's a great question. Would you like me to connect you with our team? Visit /contact for direct communication.",
  ],
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.match(/^(hi|hey|hello|help|start)/)) {
    return defaultResponses.greeting[Math.floor(Math.random() * defaultResponses.greeting.length)];
  }
  if (lower.includes('service') || lower.includes('offer')) {
    return defaultResponses.services[0];
  }
  if (lower.includes('webgpu') || lower.includes('3d') || lower.includes('render')) {
    return defaultResponses.webgpu[0];
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('plan')) {
    return defaultResponses.pricing[0];
  }
  if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('phone')) {
    return defaultResponses.contact[0];
  }
  if (lower.includes('portfolio') || lower.includes('project') || lower.includes('work') || lower.includes('case')) {
    return defaultResponses.portfolio[0];
  }
  
  return defaultResponses.default[Math.floor(Math.random() * defaultResponses.default.length)];
}

export default function AIChatBot({ position = 'bottom-right', accentColor = '#0082D8' }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Rhine AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`fixed ${position === 'bottom-right' ? 'right-6' : 'left-6'} bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50`}
        style={{ backgroundColor: accentColor }}
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${position === 'bottom-right' ? 'right-6' : 'left-6'} bottom-6 w-80 md:w-96 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50`}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">Rhine AI</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'text-white/90 bg-white/10 rounded-bl-md whitespace-pre-wrap'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: accentColor } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColor }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-full transition-colors disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
                aria-label="Send"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}

      {!isOpen && (
        <div className="p-4 text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Start a conversation →
          </button>
        </div>
      )}
    </div>
  );
}