import { Button } from "@/components/ui/button";

interface AsyncErrorFallbackProps {
  message: string;
  onRetry?: () => void;
}

const AsyncErrorFallback = ({ message, onRetry }: AsyncErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
      <p className="text-muted-foreground">{message}</p>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

export default AsyncErrorFallback;
