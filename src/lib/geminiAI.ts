import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will be limited.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const HEALTH_SYSTEM_PROMPT = `You are Sehat Saathi (स्वास्थ्य साथी), a compassionate and knowledgeable health assistant designed to help users in India, especially those in rural and underserved communities.

Your role:
- Provide helpful, accurate health information and guidance
- Ask clarifying questions to better understand symptoms
- Suggest when to seek professional medical help
- Be culturally sensitive and use simple, easy-to-understand language
- Support both Hindi and English based on user's language preference

Important guidelines:
- NEVER diagnose conditions - only provide general health information
- Always recommend consulting a doctor for serious symptoms
- Be empathetic and supportive
- Keep responses concise but helpful (2-4 sentences typically)
- If symptoms sound serious (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise seeking emergency care

You are NOT a replacement for professional medical advice. Always encourage users to consult healthcare professionals for proper diagnosis and treatment.`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export class GeminiHealthChat {
  private chat: ReturnType<ReturnType<typeof genAI.getGenerativeModel>['startChat']> | null = null;
  private history: ChatMessage[] = [];

  constructor(language: string = 'en') {
    if (!GEMINI_API_KEY) return;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const languageInstruction = language === 'hi' 
      ? '\n\nIMPORTANT: Respond in Hindi (हिंदी में जवाब दें).'
      : '\n\nIMPORTANT: Respond in English.';

    this.chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: HEALTH_SYSTEM_PROMPT + languageInstruction }],
        },
        {
          role: 'model',
          parts: [{ text: language === 'hi' 
            ? 'नमस्ते! मैं सेहत साथी हूं, आपका स्वास्थ्य सहायक। मैं आपकी स्वास्थ्य संबंधी जानकारी में मदद करने के लिए यहां हूं। कृपया बताएं, आज आप कैसा महसूस कर रहे हैं?'
            : 'Hello! I am Sehat Saathi, your health companion. I\'m here to help you with health-related information. Please tell me, how are you feeling today?'
          }],
        },
      ],
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat || !GEMINI_API_KEY) {
      return this.getFallbackResponse(message);
    }

    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  private getFallbackResponse(message: string): string {
    // Fallback responses when API is not available
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार')) {
      return 'For fever, rest well and stay hydrated. If fever persists above 102°F (39°C) for more than 2 days, or is accompanied by severe symptoms, please consult a doctor.';
    }
    
    if (lowerMessage.includes('cold') || lowerMessage.includes('cough') || lowerMessage.includes('सर्दी') || lowerMessage.includes('खांसी')) {
      return 'For cold and cough, drink warm fluids, rest, and try steam inhalation. If you have difficulty breathing or symptoms last more than a week, please see a doctor.';
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('सिर')) {
      return 'For headaches, rest in a quiet, dark room and stay hydrated. If headaches are severe, sudden, or accompanied by vision changes or neck stiffness, seek medical attention immediately.';
    }
    
    return 'I understand you have a health concern. For accurate guidance, please describe your symptoms in more detail, or consult a healthcare professional for proper evaluation.';
  }

  resetChat(language: string = 'en') {
    this.history = [];
    if (GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
      });

      const languageInstruction = language === 'hi' 
        ? '\n\nIMPORTANT: Respond in Hindi (हिंदी में जवाब दें).'
        : '\n\nIMPORTANT: Respond in English.';

      this.chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: HEALTH_SYSTEM_PROMPT + languageInstruction }],
          },
          {
            role: 'model',
            parts: [{ text: language === 'hi' 
              ? 'नमस्ते! मैं सेहत साथी हूं, आपका स्वास्थ्य सहायक। मैं आपकी स्वास्थ्य संबंधी जानकारी में मदद करने के लिए यहां हूं। कृपया बताएं, आज आप कैसा महसूस कर रहे हैं?'
              : 'Hello! I am Sehat Saathi, your health companion. I\'m here to help you with health-related information. Please tell me, how are you feeling today?'
            }],
          },
        ],
      });
    }
  }
}

// Singleton instance
let chatInstance: GeminiHealthChat | null = null;

export const getHealthChat = (language: string = 'en'): GeminiHealthChat => {
  if (!chatInstance) {
    chatInstance = new GeminiHealthChat(language);
  }
  return chatInstance;
};

export const resetHealthChat = (language: string = 'en'): GeminiHealthChat => {
  chatInstance = new GeminiHealthChat(language);
  return chatInstance;
};
