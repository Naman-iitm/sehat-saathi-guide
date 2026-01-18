import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface Message {
    senderName: string;
    text: string;
    timestamp: string;
}

interface InCallChatProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    userName: string;
}

const InCallChat: React.FC<InCallChatProps> = ({ messages, onSendMessage, userName }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200">Consultation Chat</h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.senderName === userName ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400 mb-1">{msg.senderName}</span>
                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.senderName === userName ? 'bg-primary text-primary-foreground' : 'bg-slate-700 text-slate-200'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-slate-700 flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="bg-slate-800 border-slate-600 text-sm h-9"
                />
                <Button onClick={handleSend} size="icon" className="h-9 w-9 shrink-0">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default InCallChat;
