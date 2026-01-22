import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AsyncErrorFallback from '@/components/AsyncErrorFallback';
import VoiceButton from '@/components/voice/VoiceButton';
import { useVoiceSpeech } from '@/hooks/useVoiceSpeech';
import { MessageCircle, Send, Bot, User, Plus, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
  const [autoSpeak, setAutoSpeak] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Speech Hook Integration
  const {
    isListening,
    isSpeaking,
    transcript,
    error: voiceError,
    isSupported,
    toggleListening,
    speak,
    stopSpeaking,
  } = useVoiceSpeech({
    language,
    onTranscript: (text) => {
      // When user finishes speaking, submit the message
      setInput(text);
      setTimeout(() => handleSendWithText(text), 100);
    },
    onNavigate: (route) => {
      toast({
        title: language === 'hi' ? 'नेविगेट हो रहा है...' : 'Navigating...',
        description: route,
      });
    },
  });

  // Update input field while listening (shows interim results)
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  // Show voice errors
  useEffect(() => {
    if (voiceError) {
      toast({
        title: language === 'hi' ? 'आवाज त्रुटि' : 'Voice Error',
        description: voiceError,
        variant: 'destructive',
      });
    }
  }, [voiceError, toast, language]);

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
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('voiceflow-chat-history', JSON.stringify(chatHistories));
  }, [chatHistories]);

  // Speak welcome message on first load with voice support
  useEffect(() => {
    if (isSupported && autoSpeak && messages.length === 1) {
      // Small delay to ensure voices are loaded
      const timer = setTimeout(() => {
        speak(t.welcomeMessage);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSupported]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('बुखार') || lowerMessage.includes('fever')) {
      return language === 'hi'
        ? 'बुखार कितने दिनों से है? और क्या कोई और तकलीफ भी है जैसे सर्दी, खांसी, या शरीर में दर्द?'
        : 'How many days have you had fever? Do you have any other problems like cold, cough, or body pain?';
    }

    if (lowerMessage.includes('पेट') || lowerMessage.includes('stomach') || lowerMessage.includes('दर्द')) {
      return language === 'hi'
        ? 'पेट में दर्द कहां है? क्या खाने के बाद बढ़ता है? उल्टी या दस्त हो रहे हैं क्या?'
        : 'Where is the stomach pain? Does it increase after eating? Do you have vomiting or loose motions?';
    }

    if (lowerMessage.includes('सर्दी') || lowerMessage.includes('cold') || lowerMessage.includes('खांसी') || lowerMessage.includes('cough')) {
      return language === 'hi'
        ? 'खांसी में बलगम आता है क्या? सांस लेने में दिक्कत तो नहीं? कितने दिनों से है?'
        : 'Do you have phlegm with cough? Any difficulty breathing? How many days have you had this?';
    }

    if (lowerMessage.includes('सिर') || lowerMessage.includes('head') || lowerMessage.includes('headache')) {
      return language === 'hi'
        ? 'सिर में दर्द कब से है? क्या रोशनी से दिक्कत होती है? उल्टी जैसा लगता है क्या?'
        : 'How long have you had headache? Does light bother you? Do you feel like vomiting?';
    }

    if (lowerMessage.includes('चक्कर') || lowerMessage.includes('dizzy')) {
      return language === 'hi'
        ? 'चक्कर कब आते हैं - खड़े होने पर या हमेशा? खाना ठीक से खा रहे हैं? पानी कम तो नहीं पी रहे?'
        : 'When do you feel dizzy - when standing or always? Are you eating properly? Drinking enough water?';
    }

    if (lowerMessage.includes('गंभीर') || lowerMessage.includes('serious') || lowerMessage.includes('emergency')) {
      return language === 'hi'
        ? '⚠️ आपकी स्थिति गंभीर लग रही है। कृपया तुरंत डॉक्टर को दिखाएं या 108 पर कॉल करें।'
        : '⚠️ Your condition seems serious. Please consult a doctor immediately or call 108.';
    }

    if (lowerMessage.includes('धन्यवाद') || lowerMessage.includes('thank')) {
      return language === 'hi'
        ? 'आपका स्वागत है! अपना ख्याल रखें और कोई समस्या हो तो बताएं।'
        : "You're welcome! Take care and let me know if you have any concerns.";
    }

    return language === 'hi'
      ? 'मैं समझ रहा हूं। कृपया थोड़ा और बताएं ताकि मैं बेहतर मदद कर सकूं।'
      : 'I understand. Please tell me more so I can help you better.';
  };

  const sendMessageAsync = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse = getAIResponse(text);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak the AI response if auto-speak is enabled
      if (autoSpeak && isSupported) {
        speak(aiResponse);
      }
    } catch (err) {
      console.error('AI Assistant error:', err);
      setError('Unable to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendWithText = (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    sendMessageAsync(text);
  };

  const handleSend = () => {
    handleSendWithText(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setIsTyping(true);
        sendMessageAsync(lastUserMessage.content);
      }
    }
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChatHistories(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, title: title.length > 30 ? title.substring(0, 30) + '...' : title }
          : chat
      )
    );
  };

  const switchToChat = (chatId: string) => {
    setActiveChatId(chatId);
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

    if (activeChatId === id && chatHistories.length > 1) {
      setActiveChatId(chatHistories[0].id);
    } else if (chatHistories.length <= 1) {
      setActiveChatId(null);
      createNewChat();
    }
  };

  // Speak a specific message when user clicks on it
  const handleMessageClick = (message: ChatMessage) => {
    if (isSupported && message.role === 'assistant') {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speak(message.content);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AsyncErrorFallback message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex">
      {/* Sidebar */}
      <div className="w-60 bg-secondary rounded-lg p-4 h-full mr-4 flex flex-col hidden md:flex">
        <Button onClick={createNewChat} className="w-full mb-4 gap-2">
          <Plus className="w-4 h-4" />
          {language === 'hi' ? 'नई चैट' : 'New Chat'}
        </Button>

        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
            {language === 'hi' ? 'चैट इतिहास' : 'Chat History'}
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
                    <span className="truncate text-sm">{chat.title}</span>
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
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'hi' ? 'ऑटो बोलें' : 'Auto Speak'}
            </span>
            <Button
              variant={autoSpeak ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className="gap-1"
            >
              {autoSpeak ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            {t.aiAssistant}
            {isSupported && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {language === 'hi' ? 'आवाज सक्षम' : 'Voice Enabled'}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            {language === 'hi'
              ? 'बोलकर या लिखकर अपनी स्वास्थ्य समस्या बताएं'
              : 'Speak or type your health concern'}
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="flex-1 border-2 border-border shadow-lg flex flex-col min-h-0">
          <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              {t.aiAssistant}
            </CardTitle>

            {/* Voice Controls in Header */}
            <div className="flex items-center gap-2">
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                isSupported={isSupported}
                onToggleListen={toggleListening}
                onStopSpeaking={stopSpeaking}
                size="sm"
                tooltipListen={language === 'hi' ? 'बोलने के लिए क्लिक करें' : 'Click to speak'}
                tooltipStopListen={language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
                tooltipNotSupported={language === 'hi' ? 'ब्राउज़र में वॉइस उपलब्ध नहीं' : 'Voice not supported'}
              />
            </div>
          </CardHeader>

          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 p-4 overflow-auto min-h-0"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground flex-shrink-0">
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg bg-secondary group relative ${message.role === 'assistant' && isSupported ? 'cursor-pointer hover:bg-secondary/80' : ''
                      }`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.role === 'assistant' && isSupported && (
                        <Volume2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

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

              {/* Listening indicator */}
              {isListening && (
                <div className="flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {language === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... Speak now'}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardContent className="border-t-2 border-border p-4">
            <div className="flex gap-2">
              <VoiceButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                isSupported={isSupported}
                onToggleListen={toggleListening}
                onStopSpeaking={stopSpeaking}
                showSpeakingIndicator={false}
                tooltipListen={language === 'hi' ? 'बोलने के लिए क्लिक करें' : 'Click to speak'}
                tooltipStopListen={language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
              />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening
                  ? (language === 'hi' ? 'बोलिए...' : 'Listening...')
                  : t.askHealth
                }
                disabled={loading || isListening}
                className={isListening ? 'bg-red-50 dark:bg-red-900/20 border-red-300' : ''}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim() || isListening}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {language === 'hi'
                ? 'माइक बटन दबाकर बोलें या टाइप करें'
                : 'Press mic to speak or type your message'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;