import React, { useEffect, useState } from 'react';

interface TransitionScreenProps {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({ 
  onComplete, 
  title = "Menu Alimentar",
  subtitle = "Carregando..."
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula carregamento progressivo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Aguarda um pouco antes de completar
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      {/* Logo TotalPass */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <img 
            src="/logo TP.png" 
            alt="TotalPass Logo"
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>

      {/* Título da transição */}
      <div className="text-center mb-8">
        <h2 className="text-gray-800 text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      {/* Barra de carregamento */}
      <div className="w-80 max-w-[90vw]">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, 
                hsl(142, 75%, 60%) 0%, 
                hsl(142, 75%, 50%) 50%, 
                hsl(142, 75%, 40%) 100%)`
            }}
          />
        </div>
        
        {/* Percentual */}
        <div className="text-center mt-3">
          <span className="text-gray-700 text-sm font-medium">{progress}%</span>
        </div>
      </div>

      {/* Indicador de carregamento */}
      <div className="mt-6 flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default TransitionScreen;
