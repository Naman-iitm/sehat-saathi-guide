import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const OfflineIndicator: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            // Hide the reconnected message after 3 seconds
            setTimeout(() => setShowReconnected(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Don't render anything if online and not showing reconnected message
    if (isOnline && !showReconnected) {
        return null;
    }

    const offlineText = {
        en: "You're offline. Some features may be unavailable.",
        hi: "आप ऑफ़लाइन हैं। कुछ सुविधाएं उपलब्ध नहीं हो सकती हैं।",
        bn: "আপনি অফলাইনে আছেন। কিছু বৈশিষ্ট্য অনুপলব্ধ হতে পারে।",
        mr: "तुम्ही ऑफलाइन आहात. काही वैशिष्ट्ये अनुपलब्ध असू शकतात.",
        bho: "आप ऑफ़लाइन बानी। कुछ सुविधा उपलब्ध ना हो सकेला।",
        mai: "अहाँ ऑफ़लाइन छी। किछु सुविधा उपलब्ध नहि भ सकत अछि।",
    };

    const reconnectedText = {
        en: "Back online!",
        hi: "वापस ऑनलाइन!",
        bn: "আবার অনলাইনে!",
        mr: "पुन्हा ऑनलाइन!",
        bho: "वापस ऑनलाइन!",
        mai: "फेर ऑनलाइन!",
    };

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${isOnline
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-yellow-900'
                }`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center justify-center gap-2">
                {isOnline ? (
                    <>
                        <Wifi className="w-4 h-4" />
                        <span>{reconnectedText[language] || reconnectedText.en}</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4" />
                        <span>{offlineText[language] || offlineText.en}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
