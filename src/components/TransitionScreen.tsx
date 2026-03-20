import React, { useEffect, useState } from "react";

interface TransitionScreenProps {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({
  onComplete,
  title = "Menu alimentar",
  subtitle = "Preparando experiência…",
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-8">
      <div className="mb-10">
        <img src="/logo-totalpass-new.png" alt="TotalPass" className="w-36 h-auto object-contain opacity-90" />
      </div>
      <div className="text-center mb-10 max-w-sm">
        <h2 className="app-screen-title mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="w-full max-w-xs">
        <div className="bg-muted rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center mt-3 text-xs font-medium tabular-nums text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );
};

export default TransitionScreen;
