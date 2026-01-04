import React, { useState, useEffect, useMemo } from 'react';
import { Heart } from 'lucide-react';
// OPTIONAL: if you have LanguageContext
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingScreenProps {
  onComplete: () => void;

  /** Optional enhancements */
  durationMs?: number; // total loading duration
  step?: number;       // progress increment
}

const DEFAULT_DURATION = 3000;
const DEFAULT_STEP = 2;
const INTERVAL_MS = 30;

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = DEFAULT_DURATION,
  step = DEFAULT_STEP,
}) => {
  const [progress, setProgress] = useState(0);

  // i18n (fallback safe)
  let appName = 'स्वास्थ्य साथी';
  let loadingText = 'Loading';

  try {
    const { t } = useLanguage();
    appName = t.appName;
    loadingText = t.loading;
  } catch {
    // LanguageProvider not mounted yet → fallback
  }

  // Reduced motion preference
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const totalSteps = 100 / step;
    const intervalTime = durationMs / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime || INTERVAL_MS);

    return () => clearInterval(timer);
  }, [onComplete, durationMs, step]);

  return (
    <div
      className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Logo */}
      <div className="relative mb-8">
        <Heart
          className={`w-20 h-20 text-white ${
            prefersReducedMotion ? '' : 'animate-pulse'
          }`}
          fill="white"
        />
      </div>

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white mb-8">{appName}</h1>

      {/* Progress Bar */}
      <div className="w-64 bg-white/30 rounded-full h-2 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Loading Text */}
      <p className="text-white mt-4 text-lg">{loadingText}...</p>
    </div>
  );
};

export default LoadingScreen;
