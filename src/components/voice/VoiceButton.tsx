import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface VoiceButtonProps {
    isListening: boolean;
    isSpeaking: boolean;
    isSupported: boolean;
    onToggleListen: () => void;
    onStopSpeaking?: () => void;
    size?: 'sm' | 'default' | 'lg';
    showSpeakingIndicator?: boolean;
    className?: string;
    tooltipListen?: string;
    tooltipStopListen?: string;
    tooltipNotSupported?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
    isListening,
    isSpeaking,
    isSupported,
    onToggleListen,
    onStopSpeaking,
    size = 'default',
    showSpeakingIndicator = true,
    className,
    tooltipListen = 'Click to speak',
    tooltipStopListen = 'Listening...',
    tooltipNotSupported = 'Voice not supported in this browser',
}) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    if (!isSupported) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className={cn(sizeClasses[size], 'opacity-50 cursor-not-allowed', className)}
                        >
                            <MicOff className={cn(iconSizes[size], 'text-muted-foreground')} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipNotSupported}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <div className="relative inline-flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isListening ? 'destructive' : 'outline'}
                            size="icon"
                            onClick={onToggleListen}
                            className={cn(
                                sizeClasses[size],
                                'relative transition-all duration-300',
                                isListening && 'animate-pulse ring-2 ring-red-400 ring-offset-2',
                                className
                            )}
                            aria-label={isListening ? tooltipStopListen : tooltipListen}
                        >
                            {isListening ? (
                                <>
                                    <Mic className={cn(iconSizes[size], 'text-white animate-bounce')} />
                                    {/* Pulsing rings effect */}
                                    <span className="absolute inset-0 rounded-md bg-red-500 opacity-20 animate-ping" />
                                </>
                            ) : (
                                <Mic className={cn(iconSizes[size], 'text-primary')} />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>{isListening ? tooltipStopListen : tooltipListen}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Speaking indicator */}
            {showSpeakingIndicator && isSpeaking && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onStopSpeaking}
                                className={cn(sizeClasses[size], 'text-blue-500')}
                                aria-label="Stop speaking"
                            >
                                <Volume2 className={cn(iconSizes[size], 'animate-pulse')} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Click to stop</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};

export default VoiceButton;
