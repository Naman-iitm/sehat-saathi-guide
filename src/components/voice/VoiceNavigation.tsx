import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import '@/types/speech.d.ts';

// BCP 47 Language Tags
const LANGUAGE_MAP: Record<Language, string> = {
    hi: 'hi-IN',
    en: 'en-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    bho: 'hi-IN',
    mai: 'hi-IN',
};

// Navigation commands with multilingual keywords
const NAVIGATION_COMMANDS = [
    {
        route: '/store',
        keywords: {
            en: ['open store', 'medicine store', 'store', 'medicines', 'pharmacy'],
            hi: ['दुकान खोलो', 'दवाई दुकान', 'दुकान', 'दवाइयां'],
            bn: ['দোকান খুলুন', 'ওষুধের দোকান', 'দোকান'],
            mr: ['दुकान उघडा', 'औषध दुकान', 'दुकान'],
        },
        label: { en: 'Medicine Store', hi: 'दवाई दुकान', bn: 'ওষুধের দোকান', mr: 'औषध दुकान' },
    },
    {
        route: '/nearby',
        keywords: {
            en: ['find hospital', 'nearby hospital', 'hospital', 'hospitals near me'],
            hi: ['अस्पताल खोजो', 'नजदीकी अस्पताल', 'अस्पताल'],
            bn: ['হাসপাতাল খুঁজুন', 'কাছের হাসপাতাল', 'হাসপাতাল'],
            mr: ['रुग्णालय शोधा', 'जवळचे रुग्णालय', 'रुग्णालय'],
        },
        label: { en: 'Nearby Hospitals', hi: 'नजदीकी अस्पताल', bn: 'কাছের হাসপাতাল', mr: 'जवळचे रुग्णालय' },
    },
    {
        route: '/symptoms',
        keywords: {
            en: ['track symptoms', 'symptom tracker', 'symptoms', 'my symptoms'],
            hi: ['लक्षण ट्रैकर', 'लक्षण', 'तकलीफ'],
            bn: ['লক্ষণ ট্র্যাকার', 'লক্ষণ'],
            mr: ['लक्षण ट्रॅकर', 'लक्षण'],
        },
        label: { en: 'Symptom Tracker', hi: 'लक्षण ट्रैकर', bn: 'লক্ষণ ট্র্যাকার', mr: 'लक्षण ट्रॅकर' },
    },
    {
        route: '/',
        keywords: {
            en: ['go home', 'home page', 'home', 'main page'],
            hi: ['होम जाओ', 'होम', 'मुख्य पेज'],
            bn: ['হোম যান', 'হোম', 'মূল পৃষ্ঠা'],
            mr: ['होम जा', 'होम', 'मुख्य पान'],
        },
        label: { en: 'Home', hi: 'होम', bn: 'হোম', mr: 'होम' },
    },
    {
        route: '/tips',
        keywords: {
            en: ['health tips', 'tips', 'advice'],
            hi: ['स्वास्थ्य सुझाव', 'सुझाव', 'टिप्स'],
            bn: ['স্বাস্থ্য টিপস', 'টিপস'],
            mr: ['आरोग्य टिप्स', 'टिप्स'],
        },
        label: { en: 'Health Tips', hi: 'स्वास्थ्य सुझाव', bn: 'স্বাস্থ্য টিপস', mr: 'आरोग्य टिप्स' },
    },
    {
        route: '/schemes',
        keywords: {
            en: ['government schemes', 'schemes', 'sarkari yojana'],
            hi: ['सरकारी योजना', 'योजनाएं', 'योजना'],
            bn: ['সরকারি যোজনা', 'যোজনা'],
            mr: ['सरकारी योजना', 'योजना'],
        },
        label: { en: 'Govt. Schemes', hi: 'सरकारी योजना', bn: 'সরকারি যোজনা', mr: 'सरकारी योजना' },
    },
    {
        route: '/assistant',
        keywords: {
            en: ['ai assistant', 'health assistant', 'talk to doctor', 'assistant'],
            hi: ['AI सहायक', 'सहायक', 'डॉक्टर से बात'],
            bn: ['AI সহায়ক', 'সহায়ক', 'ডাক্তারের সাথে কথা'],
            mr: ['AI सहाय्यक', 'सहाय्यक', 'डॉक्टरांशी बोला'],
        },
        label: { en: 'AI Assistant', hi: 'AI सहायक', bn: 'AI সহায়ক', mr: 'AI सहाय्यक' },
    },
    {
        route: '/reminders',
        keywords: {
            en: ['reminders', 'medicine reminder', 'my reminders', 'set reminder'],
            hi: ['रिमाइंडर', 'दवाई याद', 'याद दिलाओ'],
            bn: ['রিমাইন্ডার', 'ওষুধের রিমাইন্ডার'],
            mr: ['रिमाइंडर', 'औषध स्मरण'],
        },
        label: { en: 'Reminders', hi: 'रिमाइंडर', bn: 'রিমাইন্ডার', mr: 'रिमाइंडर' },
    },
    {
        route: '/cart',
        keywords: {
            en: ['cart', 'my cart', 'shopping cart', 'view cart'],
            hi: ['कार्ट', 'मेरा कार्ट', 'कार्ट देखो'],
            bn: ['কার্ট', 'আমার কার্ট', 'কার্ট দেখুন'],
            mr: ['कार्ट', 'माझे कार्ट', 'कार्ट पहा'],
        },
        label: { en: 'Cart', hi: 'कार्ट', bn: 'কার্ট', mr: 'कार्ट' },
    },
    {
        route: '/profile',
        keywords: {
            en: ['profile', 'my profile', 'account', 'settings'],
            hi: ['प्रोफाइल', 'मेरी प्रोफाइल', 'खाता'],
            bn: ['প্রোফাইল', 'আমার প্রোফাইল', 'অ্যাকাউন্ট'],
            mr: ['प्रोफाइल', 'माझी प्रोफाइल', 'खाते'],
        },
        label: { en: 'Profile', hi: 'प्रोफाइल', bn: 'প্রোফাইল', mr: 'प्रोफाइल' },
    },
];

interface VoiceNavigationProps {
    className?: string;
}

const VoiceNavigation: React.FC<VoiceNavigationProps> = ({ className }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const { toast } = useToast();

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [showTranscript, setShowTranscript] = useState(false);

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;

    const findMatchingRoute = useCallback((text: string): { route: string; label: string } | null => {
        const lowerText = text.toLowerCase();
        const langKey = ['bn', 'mr'].includes(language) ? language : (language === 'hi' || language === 'bho' || language === 'mai' ? 'hi' : 'en');

        for (const command of NAVIGATION_COMMANDS) {
            const keywords = command.keywords[langKey as keyof typeof command.keywords] || command.keywords.en;
            for (const keyword of keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    return {
                        route: command.route,
                        label: command.label[langKey as keyof typeof command.label] || command.label.en,
                    };
                }
            }
        }
        return null;
    }, [language]);

    const startListening = useCallback(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = LANGUAGE_MAP[language];

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            setShowTranscript(true);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += result;
                } else {
                    interimTranscript += result;
                }
            }

            setTranscript(finalTranscript || interimTranscript);

            if (finalTranscript) {
                const match = findMatchingRoute(finalTranscript);
                if (match && match.route !== location.pathname) {
                    toast({
                        title: language === 'hi' ? 'नेविगेट हो रहा है' : 'Navigating',
                        description: match.label,
                    });
                    navigate(match.route);
                } else if (!match) {
                    toast({
                        title: language === 'hi' ? 'समझ नहीं पाया' : 'Did not understand',
                        description: finalTranscript,
                        variant: 'destructive',
                    });
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Voice navigation error:', event.error);
            setIsListening(false);

            if (event.error !== 'no-speech') {
                toast({
                    title: language === 'hi' ? 'आवाज त्रुटि' : 'Voice Error',
                    description: event.error,
                    variant: 'destructive',
                });
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setTimeout(() => setShowTranscript(false), 2000);
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Failed to start voice navigation:', err);
        }
    }, [SpeechRecognition, language, findMatchingRoute, location.pathname, navigate, toast]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        setShowTranscript(false);
    }, []);

    if (!isSupported) return null;

    return (
        <>
            {/* Floating Voice Navigation Button */}
            <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                className={cn(
                    'fixed bottom-20 right-5 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300',
                    isListening && 'animate-pulse ring-4 ring-red-400/50',
                    className
                )}
                aria-label={isListening ? 'Stop listening' : 'Voice navigation'}
            >
                {isListening ? (
                    <Mic className="h-6 w-6 animate-bounce" />
                ) : (
                    <Mic className="h-6 w-6" />
                )}
            </Button>

            {/* Transcript Overlay */}
            {showTranscript && (
                <div className="fixed bottom-36 right-5 z-50 max-w-xs animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    {isListening
                                        ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
                                        : (language === 'hi' ? 'सुना गया' : 'Heard')}
                                </p>
                                <p className="text-sm font-medium">
                                    {transcript || (language === 'hi' ? 'बोलिए...' : 'Speak now...')}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-2 -mt-2"
                                onClick={() => setShowTranscript(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Quick command hints */}
                        {isListening && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-[10px] text-muted-foreground mb-2">
                                    {language === 'hi' ? 'बोलें:' : 'Try saying:'}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {NAVIGATION_COMMANDS.slice(0, 4).map((cmd) => {
                                        const langKey = language === 'hi' || language === 'bho' || language === 'mai' ? 'hi' : (language === 'bn' ? 'bn' : (language === 'mr' ? 'mr' : 'en'));
                                        const keyword = cmd.keywords[langKey as keyof typeof cmd.keywords]?.[0] || cmd.keywords.en[0];
                                        return (
                                            <span
                                                key={cmd.route}
                                                className="text-[10px] px-2 py-0.5 bg-secondary rounded-full"
                                            >
                                                "{keyword}"
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VoiceNavigation;
