import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { GeminiHealthChat, resetHealthChat } from '@/lib/geminiAI';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

const STORAGE_KEY = 'sehat-saathi-chat-sessions';

const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<GeminiHealthChat | null>(null);

  // Get active session
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Initialize chat instance
  useEffect(() => {
    chatRef.current = resetHealthChat(language);
  }, [language]);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((s: ChatSession) => ({
          ...s,
          timestamp: new Date(s.timestamp),
          messages: s.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error('Error loading chat sessions:', e);
      }
    }
  }, []);

  // Create initial session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewChat();
    }
  }, [sessions.length]);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const createNewChat = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: language === 'hi' 
        ? 'नमस्ते! मैं सेहत साथी हूं, आपका स्वास्थ्य सहायक। आज आप कैसा महसूस कर रहे हैं?'
        : 'Hello! I am Sehat Saathi, your health companion. How are you feeling today?',
      timestamp: now,
    };

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: language === 'hi' ? `नई चैट ${timeString}` : `New Chat ${timeString}`,
      messages: [welcomeMessage],
      timestamp: now,
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    chatRef.current = resetHealthChat(language);
    setError(null);
  };

  const switchToChat = (sessionId: string) => {
    setActiveSessionId(sessionId);
    chatRef.current = resetHealthChat(language);
    setError(null);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeSessionId === id) {
        if (filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
        } else {
          setActiveSessionId(null);
        }
      }
      return filtered;
    });
  };

  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 25 ? firstMessage.substring(0, 25) + '...' : firstMessage;
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ));
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !activeSessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Update session with user message
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, messages: [...s.messages, userMessage] }
        : s
    ));

    // Update title if this is the first user message
    if (messages.filter(m => m.role === 'user').length === 0) {
      updateSessionTitle(activeSessionId, input.trim());
    }

    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      if (!chatRef.current) {
        chatRef.current = resetHealthChat(language);
      }

      const response = await chatRef.current.sendMessage(input.trim());

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, aiMessage] }
          : s
      ));
    } catch (err) {
      console.error('AI error:', err);
      setError(language === 'hi' 
        ? 'AI से जवाब नहीं मिल सका। कृपया फिर से कोशिश करें।'
        : 'Could not get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex">
      {/* Sidebar */}
      <div className="w-60 bg-secondary rounded-lg p-4 h-full mr-4 flex-col hidden md:flex">
        <Button onClick={createNewChat} className="w-full mb-4 gap-2">
          <Plus className="w-4 h-4" />
          {language === 'hi' ? 'नई चैट' : 'New Chat'}
        </Button>
        
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
            {language === 'hi' ? 'चैट इतिहास' : 'Chat History'}
          </h3>
          
          <div className="space-y-1">
            {sessions.map((session) => (
              <Card 
                key={session.id}
                className={`cursor-pointer transition-colors ${activeSessionId === session.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => switchToChat(session.id)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{session.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto hover:text-destructive"
                    onClick={(e) => deleteChat(session.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">{t.aiAssistant}</h1>
          <p className="text-sm text-muted-foreground">
            {language === 'hi' 
              ? 'Google Gemini AI द्वारा संचालित स्वास्थ्य सहायक' 
              : 'Health assistant powered by Google Gemini AI'}
          </p>
        </div>

        {/* Mobile: New Chat Button */}
        <div className="md:hidden mb-4">
          <Button onClick={createNewChat} variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {language === 'hi' ? 'नई चैट' : 'New Chat'}
          </Button>
        </div>
        
        {/* Chat Interface */}
        <Card className="flex-1 border-2 border-border shadow-lg flex flex-col min-h-0">
          <CardHeader className="bg-primary text-primary-foreground py-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Bot className="w-5 h-5" />
              {language === 'hi' ? 'सेहत साथी' : 'Sehat Saathi'}
            </CardTitle>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-secondary p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'hi' ? 'सोच रहा हूं...' : 'Thinking...'}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <CardContent className="border-t-2 border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask your health question...'}
                disabled={isTyping}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isTyping || !input.trim()}>
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {language === 'hi' 
                ? '⚠️ यह चिकित्सा सलाह का विकल्प नहीं है। गंभीर लक्षणों के लिए डॉक्टर से मिलें।'
                : '⚠️ This is not a substitute for medical advice. Consult a doctor for serious symptoms.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
