import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentChatData, setCurrentChatData] = useState<any>(null);

  // Load chat history from localStorage on component mount
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
    
    // Set up a new chat if none exists
    if (chatHistories.length === 0) {
      createNewChat();
    }
  }, []);

  // Function to update chat title based on first user message
  const updateChatTitle = (chatId: string, title: string) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: title.length > 30 ? title.substring(0, 30) + '...' : title }
          : chat
      )
    );
  };

  // Function to switch between chats
  const switchToChat = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Note: Voiceflow manages its own conversation state internally
    // We can't truly switch between different conversation contexts
    // The chat history is for organizational purposes only
    console.log(`Switched to chat: ${chatId}`);
  };

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('voiceflow-chat-history', JSON.stringify(chatHistories));
  }, [chatHistories]);
  
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
  };
  
  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setChatHistories(prev => prev.filter(chat => chat.id !== id));
    
    // If we're deleting the active chat, switch to the first one
    if (activeChatId === id && chatHistories.length > 1) {
      setActiveChatId(chatHistories[0].id);
    } else if (chatHistories.length <= 1) {
      // If no chats left, create a new one
      setActiveChatId(null);
      createNewChat();
    }
  };
  
  useEffect(() => {
    // Load Voiceflow embedded chat
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
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
        // Enable chat history persistence
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
      // Clean up the script when component unmounts
      scriptParentElement.removeChild(script);
      
      // Remove any Voiceflow elements if they exist
      const vfElements = document.querySelectorAll('[id*="voiceflow"], [class*="voiceflow"]');
      vfElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex">
      {/* Sidebar */}
      <div className="w-60 bg-secondary rounded-lg p-4 h-full mr-4 flex flex-col">
        <Button onClick={createNewChat} className="w-full mb-4 gap-2">
          <Plus className="w-4 h-4" />
          {language === 'hi' ? 'नई चैट' : 'New Chat'}
        </Button>
        
        <div className="flex-1 overflow-y-auto mt-10">
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
                    <span className="truncate text-sm">
                      {chat.title}
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
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-[2] flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.aiAssistant}</h1>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'हमारे वॉयस फ्लो हैल्थ एआई सहायक के साथ बात करें' : 'Talk with our Health AI assistant'}
          </p>
        </div>
        
        {/* Voiceflow embedded chat will be loaded here */}
        <div id="voiceflow-embedded-chat" className="flex-1 w-full rounded-lg border overflow-hidden">
          {/* The Voiceflow embedded chat will be injected here */}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
