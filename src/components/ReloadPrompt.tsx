import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const ReloadPrompt = () => {
    const { toast } = useToast();

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    useEffect(() => {
        if (offlineReady) {
            toast({
                title: "App is ready to work offline",
                description: "Content has been cached for offline use.",
                action: <ToastAction altText="Close" onClick={close}>Dismiss</ToastAction>,
            });
        }
    }, [offlineReady, toast]);

    useEffect(() => {
        if (needRefresh) {
            toast({
                title: "New content available",
                description: "Click reload to update the app.",
                action: (
                    <ToastAction altText="Reload" onClick={() => updateServiceWorker(true)}>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Reload
                        </div>
                    </ToastAction>
                ),
                duration: Infinity, // Don't auto-dismis for update
            });
        }
    }, [needRefresh, toast, updateServiceWorker]);

    return null;
};

export default ReloadPrompt;
