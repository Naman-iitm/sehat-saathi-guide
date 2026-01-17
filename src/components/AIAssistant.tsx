import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AsyncErrorFallback from '@/components/AsyncErrorFallback';
import { MessageCircle, Send, Bot, User, Plus, Trash2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {

  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount

  useEffect(() => {

    const savedHistory = localStorage.getItem('voiceflow-chat-history');

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));

        setChatHistories(parsedHistory);
      } catch (e) {

        console.error('Error loading chat history:', e);

      }
    }

    if (chatHistories.length === 0) {
      createNewChat();
    }
  }, []);

  // Smooth scroll to bottom when messages change

  useEffect(() => {

    const scrollToBottom = () => {

      if (messagesEndRef.current && scrollAreaRef.current) {

        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    // Use a small delay to ensure DOM is updated

    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  // Save chat history to localStorage whenever it changes

  useEffect(() => {
    localStorage.setItem('voiceflow-chat-history', JSON.stringify(chatHistories));
  }, [chatHistories]);

  // Load Voiceflow embedded chat

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () {
      // @ts-ignore
      window.voiceflow.chat.load({
        verify: { projectID: '695a5f1cf022b12146863e82' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        },
        render: {
          mode: 'embedded',
          target: document.getElementById('voiceflow-embedded-chat')
        },
        config: {
          history: {
            enabled: true,
            persist: true
          }
        }
      });
    };
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";

    const scriptParentElement = document.getElementsByTagName('head')[0];
    scriptParentElement.appendChild(script);

    return () => {
      scriptParentElement.removeChild(script);

      const vfElements = document.querySelectorAll('[id*="voiceflow"], [class*="voiceflow"]');
      vfElements.forEach(el => el.remove());
    };
  }, []);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('बुखार') || lowerMessage.includes('fever')) 
      {
      return language === 'hi'
        ? 'बुखार कितने दिनों से है? और क्या कोई और तकलीफ भी है जैसे सर्दी, खांसी, या शरीर में दर्द?'
        : 'How many days have you had fever? Do you have any other problems like cold, cough, or body pain?';
    }

    if (lowerMessage.includes('पेट') || lowerMessage.includes('stomach') || lowerMessage.includes('दर्द')) 
      {
      return language === 'hi'
        ? 'पेट में दर्द कहां है? क्या खाने के बाद बढ़ता है? उल्टी या दस्त हो रहे हैं क्या?'
        : 'Where is the stomach pain? Does it increase after eating? Do you have vomiting or loose motions?';
    }

    if (lowerMessage.includes('सर्दी') || lowerMessage.includes('cold') || lowerMessage.includes('खांसी') || lowerMessage.includes('cough')) 
      {
      return language === 'hi'
        ? 'खांसी में बलगम आता है क्या? सांस लेने में दिक्कत तो नहीं? कितने दिनों से है?'
        : 'Do you have phlegm with cough? Any difficulty breathing? How many days have you had this?';
    }

    if (lowerMessage.includes('सिर') || lowerMessage.includes('head') || lowerMessage.includes('headache')) 
      {
      return language === 'hi'
        ? 'सिर में दर्द कब से है? क्या रोशनी से दिक्कत होती है? उल्टी जैसा लगता है क्या?'
        : 'How long have you had headache? Does light bother you? Do you feel like vomiting?';
    }

    if (lowerMessage.includes('चक्कर') || lowerMessage.includes('dizzy')) 
      {
      return language === 'hi'
        ? 'चक्कर कब आते हैं - खड़े होने पर या हमेशा? खाना ठीक से खा रहे हैं? पानी कम तो नहीं पी रहे?'
        : 'When do you feel dizzy - when standing or always? Are you eating properly? Drinking enough water?';
    }

    if (lowerMessage.includes('गंभीर') || lowerMessage.includes('serious')) 
      {
      return language === 'hi'
        ? '⚠️ आपकी स्थिति गंभीर लग रही है। कृपया तुरंत डॉक्टर को दिखाएं।'
        : '⚠️ Your condition seems serious. Please consult a doctor immediately.';
    }

    return language === 'hi'
      ? 'मैं समझ रहा हूं। कृपया थोड़ा और बताएं।'
      : 'I understand. Please tell me more.';
  };

  const sendMessageAsync = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('AI Assistant error:', err);
      setError('Unable to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    sendMessageAsync(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => 
    {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission
      handleSend();
    }
  };

  const handleRetry = () => 
    {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setIsTyping(true);
        sendMessageAsync(lastUserMessage.content);
      }
    }
  };

  const updateChatTitle = (chatId: string, title: string) => 
    {
    setChatHistories(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: title.length > 30 ? title.substring(0, 30) + '...' : title }
          : chat
      )
    );
  };

  const switchToChat = (chatId: string) => 
    {
    setActiveChatId(chatId);
    console.log(`Switched to chat: ${chatId}`);
  };

  const createNewChat = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat: ChatHistoryItem = {
      id: Date.now().toString(),
      title: language === 'hi' ? `नई चैट ${timeString}` : `New Chat ${timeString}`,
      timestamp: now
    };

    setChatHistories(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t.welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setChatHistories(prev => prev.filter(chat => chat.id !== id));

    if (activeChatId === id && chatHistories.length > 1) 
      {
      setActiveChatId(chatHistories[0].id);
    } 
    else if (chatHistories.length <= 1) 
      {
      setActiveChatId(null);
      createNewChat();
    }
  };

  if (error) 
    {
    return (
      <div className="container mx-auto px-4 py-8">
        <AsyncErrorFallback message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex">
      {
      /* Sidebar */
      }
      <div className="w-60 bg-secondary rounded-lg p-4 h-full mr-4 flex flex-col">
        <Button onClick={createNewChat} className="w-full mb-4 gap-2">
          <Plus className="w-4 h-4" />
          {
          language === 'hi' ? 'नई चैट' : 'New Chat'
          }
        </Button>

        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
            {
            language === 'hi' ? 'चैट इतिहास' : 'Chat History'
            }
          </h3>

          <div className="space-y-1">
            {chatHistories.map((chat) => (
              <Card
                key={chat.id}
                className={`cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => switchToChat(chat.id)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {
                      chat.title
                      }
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-muted-foreground hover:text-destructive"
                    onClick={(e) => deleteChat(chat.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )
            )
        }
          </div>
        </div>
      </div>

      {
      /* Main Chat Area */
      }
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t.aiAssistant}
            </h1>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'हमारे वॉयस फ्लो हैल्थ एआई सहायक के साथ बात करें' : 'Talk with our Health AI assistant'}
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="flex-1 border-2 border-border shadow-lg flex flex-col min-h-0">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              {t.aiAssistant}
            </CardTitle>
          </CardHeader>

          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 p-4 overflow-auto min-h-0"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="max-w-[80%] p-3 rounded-lg bg-secondary">
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {
                      message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    </p>
                  </div>
                </div>
              )
              )
              }

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="max-w-[80%] p-3 rounded-lg bg-secondary">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardContent className="border-t-2 border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={
                  handleKeyPress
                }
                placeholder={
                  t.askHealth
                }
                disabled={
                  loading}
                  
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {language === 'hi' ? 'चैट शुरू करने के लिए मैसेज लिखें और भेजें' : 'Type a message to start chatting'}
            </p>
          </CardContent>
        </Card>

        {/* Voiceflow embedded chat (hidden but available) */}
        <div id="voiceflow-embedded-chat" className="hidden">
          {/* Voiceflow will be injected here if needed */}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;