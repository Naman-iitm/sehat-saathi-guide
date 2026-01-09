import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, WifiOff } from 'lucide-react';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, installApp } = usePWA();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = React.useState(() => {
    return localStorage.getItem('pwa-prompt-dismissed') === 'true';
  });

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'hi' 
                ? 'ऑफ़लाइन एक्सेस के लिए इंस्टॉल करें' 
                : 'Install for offline access'}
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall}>
                {language === 'hi' ? 'इंस्टॉल' : 'Install'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                {language === 'hi' ? 'बाद में' : 'Later'}
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();
  const { language } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-950 text-center py-2 text-sm font-medium z-50 flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      {language === 'hi' ? 'आप ऑफ़लाइन हैं' : "You're offline"}
    </div>
  );
};

export default PWAInstallPrompt;
