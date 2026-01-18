import React, { useContext } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { LanguageContext } from '../../contexts/LanguageContext';

interface Props {
  onRetry: () => void;
}

const DefaultFallback: React.FC<Props> = ({ onRetry }) => {
  const context = useContext(LanguageContext);

  let title = 'Something went wrong';
  let message = 'Please try again. Your data is safe.';
  let retry = 'Retry';

  if (context) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = context.t as any;
    if (t.errorTitle) title = t.errorTitle;
    if (t.errorMessage) message = t.errorMessage;
    if (t.retry) retry = t.retry;
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
