import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '@/contexts/LanguageContext';

// BCP 47 Language Tags for Speech Recognition and Synthesis
const LANGUAGE_MAP: Record<Language, string> = {
    hi: 'hi-IN',  // Hindi (India)
    en: 'en-IN',  // English (India)
    bn: 'bn-IN',  // Bengali (India)
    mr: 'mr-IN',  // Marathi (India)
    bho: 'hi-IN', // Bhojpuri (fallback to Hindi)
    mai: 'hi-IN', // Maithili (fallback to Hindi)
};

// Voice navigation commands mapped to routes
const NAVIGATION_COMMANDS: Record<string, { keywords: string[], route: string }> = {
    store: {
        keywords: ['open store', 'medicine store', 'दुकान खोलो', 'दवाई दुकान', 'ওষুধের দোকান', 'औषध दुकान'],
        route: '/store'
    },
    hospital: {
        keywords: ['find hospital', 'nearby hospital', 'अस्पताल खोजो', 'नजदीकी अस्पताल', 'হাসপাতাল', 'रुग्णालय'],
        route: '/nearby'
    },
    symptoms: {
        keywords: ['track symptoms', 'symptom tracker', 'लक्षण ट्रैकर', 'লক্ষণ ট্র্যাকার', 'लक्षण ट्रॅकर'],
        route: '/symptoms'
    },
    home: {
        keywords: ['go home', 'home page', 'होम जाओ', 'होम', 'হোম', 'होव'],
        route: '/'
    },
    tips: {
        keywords: ['health tips', 'स्वास्थ्य सुझाव', 'आरोग्य टिप्स', 'স্বাস্থ্য টিপস'],
        route: '/tips'
    },
    schemes: {
        keywords: ['government schemes', 'sarkari yojana', 'सरकारी योजना', 'সরকারি যোজনা'],
        route: '/schemes'
    },
    assistant: {
        keywords: ['ai assistant', 'health assistant', 'सहायक', 'AI সহায়ক'],
        route: '/assistant'
    },
    reminders: {
        keywords: ['reminders', 'medicine reminder', 'दवाई याद', 'ওষুধের মনে করিয়ে দেওয়া'],
        route: '/reminders'
    },
};

interface UseVoiceSpeechOptions {
    language: Language;
    onTranscript?: (text: string) => void;
    onNavigate?: (route: string) => void;
    autoSpeak?: boolean;
}

interface UseVoiceSpeechReturn {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    toggleListening: () => void;
}

export const useVoiceSpeech = ({
    language,
    onTranscript,
    onNavigate,
    autoSpeak = true,
}: UseVoiceSpeechOptions): UseVoiceSpeechReturn => {
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition && !!window.speechSynthesis;

    // Initialize speech synthesis
    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        // Pre-load voices (some browsers need this)
        const loadVoices = () => {
            synthRef.current?.getVoices();
        };

        loadVoices();
        if (synthRef.current) {
            synthRef.current.onvoiceschanged = loadVoices;
        }

        return () => {
            stopSpeaking();
            stopListening();
        };
    }, []);

    // Check for navigation commands
    const checkNavigationCommands = useCallback((text: string): boolean => {
        const lowerText = text.toLowerCase();

        for (const [, config] of Object.entries(NAVIGATION_COMMANDS)) {
            for (const keyword of config.keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    if (onNavigate) {
                        onNavigate(config.route);
                    }
                    navigate(config.route);
                    return true;
                }
            }
        }
        return false;
    }, [navigate, onNavigate]);

    // Start listening
    const startListening = useCallback(() => {
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser');
            return;
        }

        // Stop any ongoing speech
        stopSpeaking();

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = LANGUAGE_MAP[language];

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
            setTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            setTranscript(currentTranscript);

            // If we have a final result
            if (finalTranscript) {
                // Check for navigation commands first
                const isNavigation = checkNavigationCommands(finalTranscript);

                // If not a navigation command, pass to callback
                if (!isNavigation && onTranscript) {
                    onTranscript(finalTranscript);
                }
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);

            let errorMessage = 'An error occurred during speech recognition';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = language === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी' : 'No speech detected';
                    break;
                case 'not-allowed':
                    errorMessage = language === 'hi' ? 'माइक्रोफोन की अनुमति नहीं है' : 'Microphone access denied';
                    break;
                case 'network':
                    errorMessage = language === 'hi' ? 'नेटवर्क त्रुटि' : 'Network error';
                    break;
            }

            setError(errorMessage);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
            setError('Failed to start speech recognition');
        }
    }, [SpeechRecognition, language, onTranscript, checkNavigationCommands]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Find best matching voice for language
    const findVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
        const voices = synthRef.current?.getVoices() || [];

        // Try exact match first
        let voice = voices.find(v => v.lang === lang);

        // Try partial match (e.g., 'hi' matches 'hi-IN')
        if (!voice) {
            const langPrefix = lang.split('-')[0];
            voice = voices.find(v => v.lang.startsWith(langPrefix));
        }

        // Fallback to any available voice
        if (!voice && voices.length > 0) {
            voice = voices[0];
        }

        return voice || null;
    }, []);

    // Speak text
    const speak = useCallback((text: string) => {
        if (!synthRef.current || !text.trim()) return;

        // Stop any ongoing speech
        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        currentUtteranceRef.current = utterance;

        const langTag = LANGUAGE_MAP[language];
        utterance.lang = langTag;

        const voice = findVoice(langTag);
        if (voice) {
            utterance.voice = voice;
        }

        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
        };

        synthRef.current.speak(utterance);
    }, [language, findVoice]);

    // Stop speaking
    const stopSpeaking = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        toggleListening,
    };
};

export default useVoiceSpeech;
