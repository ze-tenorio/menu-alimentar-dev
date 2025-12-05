import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface MenuLoadingScreenProps {
  onComplete: () => void;
  onBack: () => void;
  type?: 'creating' | 'loading-history';
}

const MenuLoadingScreen: React.FC<MenuLoadingScreenProps> = ({ onComplete, onBack, type = 'creating' }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Dica: Lembre-se de beber bastante água ao longo do dia!",
    "Dica: Consuma frutas e verduras em todas as refeições!",
    "Dica: Evite alimentos processados e prefira os naturais!",
    "Dica: Faça refeições em horários regulares!",
    "Dica: Mastigue bem os alimentos para melhor digestão!"
  ];

  useEffect(() => {
    // Animação de progresso contínua (não chama onComplete automaticamente)
    const interval = setInterval(() => {
      setProgress(prev => {
        // Progresso vai até 95% e para (aguardando API)
        if (prev >= 95) {
          return 95;
        }
        return prev + 1;
      });
    }, 300); // Mais lento para dar tempo da API responder

    // Muda a dica a cada 3 segundos
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <span className="text-4xl">
              {type === 'loading-history' ? '📋' : '🏋️‍♂️'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-[90vw] mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-primary text-lg font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center mb-8">
          {type === 'loading-history' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Carregando seus menus...</h2>
              <p className="text-gray-600">Buscando seu histórico de planos alimentares</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Criando seu menu...</h2>
              <p className="text-gray-600">Analisando suas respostas e personalizando seu plano alimentar</p>
              <p className="text-gray-500 text-sm mt-2">Isso pode levar de 20 a 30 segundos...</p>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="w-full max-w-md">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700 text-sm">
                {tips[currentTip]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuLoadingScreen;
