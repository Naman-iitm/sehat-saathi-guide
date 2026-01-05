import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  onRetry: () => void;
}

const DefaultFallback: React.FC<Props> = ({ onRetry }) => {
  let title = 'Something went wrong';
  let message = 'Please try again. Your data is safe.';
  let retry = 'Retry';

  try {
    const { t } = useLanguage();
    title = t.errorTitle;
    message = t.errorMessage;
    retry = t.retry;
  } catch {
    // Safe fallback if language context fails
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6"
    >
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />

      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        <RefreshCcw className="w-4 h-4" />
        {retry}
      </button>
    </div>
  );
};

export default DefaultFallback;
