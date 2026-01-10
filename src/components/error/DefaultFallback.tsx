import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  onRetry: () => void;
}

const DefaultFallback: React.FC<Props> = ({ onRetry }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6"
    >
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Please try again. Your data is safe.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
};

export default DefaultFallback;
