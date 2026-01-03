import React, { useState } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AIAssistantPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    {
      text: 'Hello! I\'m your health assistant. How can I help you today?',
      sender: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const { language } = useLanguage();

  const quickQuestions = [
    { hi: 'लक्षण कैसे ट्रैक करें?', en: 'How to track symptoms?' },
    { hi: 'दवाई कैसे खरीदें?', en: 'How to buy medicines?' },
    { hi: 'AI सहायता कैसे काम करती है?', en: 'How does AI help work?' },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: language === 'hi'
            ? 'मैं आपकी मदद के लिए यहाँ हूँ। कृपया अपना सवाल विस्तार से बताएं।'
            : 'I\'m here to help you. Please tell me more about your question.',
          sender: 'ai',
        },
      ]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setMessages([...messages, { text: question, sender: 'user' }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: language === 'hi'
            ? 'यह एक बेहतरीन सवाल है! मैं आपको इसका विस्तृत उत्तर दूंगा।'
            : 'That\'s a great question! Let me provide you with a detailed answer.',
          sender: 'ai',
        },
      ]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-2xl border-2 border-primary/20">
          <CardHeader className="p-4 bg-gradient-to-r from-primary to-accent cursor-pointer" onClick={() => setIsMinimized(false)}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">
                  {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <Card className="w-96 h-[600px] shadow-2xl border-2 border-primary/20 flex flex-col">
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-primary to-accent text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {language === 'hi' ? 'AI स्वास्थ्य सहायक' : 'AI Health Assistant'}
                </h3>
                <p className="text-xs text-white/80">
                  {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white border border-border text-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground font-medium px-2">
                {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick questions:'}
              </p>
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(language === 'hi' ? q.hi : q.en)}
                  className="w-full text-left px-4 py-3 bg-white border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
                >
                  {language === 'hi' ? q.hi : q.en}
                </button>
              ))}
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hi' ? 'अपना सवाल लिखें...' : 'Type your question...'}
              className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <Button
              onClick={handleSend}
              size="lg"
              className="px-4 rounded-xl"
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistantPopup;
