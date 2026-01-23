import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOffline } from '@/hooks/useOffline';
import { syncQueue } from '@/lib/syncQueue';
import { Button } from './ui/button';

const OfflineIndicator: React.FC = () => {
    const { isOnline, pendingCount } = useOffline();
    const [showReconnected, setShowReconnected] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        if (isOnline) {
            setShowReconnected(true);
            const timer = setTimeout(() => setShowReconnected(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setShowReconnected(false);
        }
    }, [isOnline]);

    const handleManualSync = async () => {
        setIsSyncing(true);
        await syncQueue.processQueue();
        setIsSyncing(false);
    };

    if (isOnline && !showReconnected && pendingCount === 0) {
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

    const syncPendingText = {
        en: `${pendingCount} item(s) pending sync`,
        hi: `${pendingCount} आइटम सिंक होना बाकी है`,
        bn: `${pendingCount} টি আইটেম সিঙ্ক বাকি আছে`,
        mr: `${pendingCount} आयटम सिंक करणे बाकी आहे`,
    };

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 transition-all duration-300 ${isOnline && pendingCount > 0
                ? 'bg-blue-500 text-white'
                : isOnline
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-yellow-900'
                }`}
            role="alert"
            aria-live="polite"
        >
            <div className="container mx-auto flex items-center justify-between gap-2 max-w-7xl">
                <div className="flex items-center gap-2">
                    {isOnline ? (
                        pendingCount > 0 ? <Cloud className="w-4 h-4" /> : <Wifi className="w-4 h-4" />
                    ) : (
                        <WifiOff className="w-4 h-4" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                        {isOnline
                            ? (pendingCount > 0 ? (syncPendingText[language] || syncPendingText.en) : (reconnectedText[language] || reconnectedText.en))
                            : (offlineText[language] || offlineText.en)
                        }
                    </span>
                </div>

                {isOnline && pendingCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white border-none"
                    >
                        {isSyncing ? (
                            <RefreshCcw className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                            <Cloud className="w-3 h-3 mr-1" />
                        )}
                        Sync Now
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
