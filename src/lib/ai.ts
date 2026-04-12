export interface AIContext {
  userId?: string;
  currentPage?: string;
  timestamp: number;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  confidence: number;
  suggestedActions?: string[];
}

const STORAGE_KEY = 'rhine-ai-conversation';
const MAX_MESSAGES = 50;

export class AIService {
  private context: AIContext = { timestamp: Date.now() };
  private conversation: AIMessage[] = [];

  constructor() {
    this.loadConversation();
  }

  setContext(context: Partial<AIContext>) {
    this.context = { ...this.context, ...context };
  }

  private loadConversation() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.conversation = parsed.map((m: AIMessage) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch {
      this.conversation = [];
    }
  }

  private saveConversation() {
    try {
      const toStore = this.conversation.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  private addMessage(role: 'user' | 'assistant', content: string): AIMessage {
    const message: AIMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };

    this.conversation.push(message);
    if (this.conversation.length > MAX_MESSAGES) {
      this.conversation = this.conversation.slice(-MAX_MESSAGES);
    }

    this.saveConversation();
    return message;
  }

  private getContextResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    if (lower.match(/^(hi|hey|hello|help|start)/)) {
      return `${timeGreeting}! I'm Rhine AI. I can help you with:\n\n• **Services** - Learn about our web development, cloud, and AI solutions\n• **Portfolio** - See our recent projects\n• **Contact** - Get in touch with our team\n• **Pricing** - View our transparent pricing\n\nWhat would you like to explore?`;
    }

    if (lower.includes('service')) {
      return `We offer comprehensive digital solutions:\n\n🖥️ **Web Development**\nModern React/TypeScript applications with cutting-edge tech\n\n☁️ **Cloud Infrastructure**\nAWS, GCP, Azure solutions that scale\n\n🤖 **AI & Automation**\nIntelligent workflows and machine learning\n\n🔒 **Cybersecurity**\nEnterprise-grade protection for your assets\n\n💼 **Enterprise Software**\nCustom business solutions\n\nWould you like to learn more about any of these?`;
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
      return `We have flexible pricing tiers:\n\n🌱 **Starter** - Free\n• Basic features\n• Community support\n\n🚀 **Professional** - $29/month\n• Full features\n• Priority support\n• Analytics dashboard\n\n🏢 **Enterprise** - $99/month\n• Custom solutions\n• Dedicated support\n• SLA guarantee\n\nVisit /pricing for more details!`;
    }

    if (lower.includes('contact') || lower.includes('reach') || lower.includes('email')) {
      return `Get in touch with us:\n\n✉️ **Email**: hello@rhinesolution.com\n📱 **Form**: /contact\n💬 **Chat**: Use this chat!\n\nOur team typically responds within 24 hours. We look forward to hearing from you!`;
    }

    if (lower.includes('portfolio') || lower.includes('project')) {
      return `Check out our work at /portfolio!\n\nWe've delivered solutions across:\n• E-commerce platforms\n• SaaS applications\n• Cloud infrastructure\n• AI integrations\n• Enterprise systems\n\nEach project showcases our commitment to quality and innovation.`;
    }

    if (lower.includes('tech') || lower.includes('stack') || lower.includes('technology')) {
      return `Our technology stack:\n\n**Frontend**: React 18, TypeScript, Vite\n**Styling**: Tailwind CSS, DaisyUI\n**3D**: Three.js, WebGPU\n**Backend**: Supabase, PostgreSQL\n**Deployment**: Cloudflare, Docker\n\nWe choose the right tool for each project!`;
    }

    if (lower.includes('help') || lower.includes('support')) {
      return `Here's how I can help:\n\n• **Navigation** - Ask about pages like /services, /portfolio, /pricing\n• **Information** - Learn about our tech stack and approach\n• **Contact** - Get help reaching our team\n• **General questions** - Ask anything about our services\n\nWhat would you like to know?`;
    }

    return `Thanks for your message! I can help you with:\n\n• Learning about our **services** and **technology**\n• Viewing our **portfolio** and **case studies**\n• Understanding our **pricing** plans\n• Getting **support** or contacting our team\n\nYou can also visit /services, /portfolio, or /contact for more information. Is there something specific I can help you with?`;
  }

  async sendMessage(content: string): Promise<AIResponse> {
    this.addMessage('user', content);

    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const responseText = this.getContextResponse(content);
    this.addMessage('assistant', responseText);

    return {
      message: responseText,
      confidence: 0.95,
      suggestedActions: ['Learn about services', 'View pricing', 'Contact us'],
    };
  }

  getConversation(): AIMessage[] {
    return [...this.conversation];
  }

  clearConversation() {
    this.conversation = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  getSuggestions(): string[] {
    return [
      'What services do you offer?',
      'Show me your pricing',
      'View your portfolio',
      'How can I contact you?',
      'What technologies do you use?',
    ];
  }
}

export const aiService = new AIService();
export default aiService;
