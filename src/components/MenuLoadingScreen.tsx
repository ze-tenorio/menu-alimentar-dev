import React, { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Lightbulb, Map } from "lucide-react";

interface MenuLoadingScreenProps {
  onComplete: () => void;
  onBack: () => void;
  type?: "creating" | "loading-history";
}

const MenuLoadingScreen: React.FC<MenuLoadingScreenProps> = ({ onComplete: _unused, onBack, type = "creating" }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Lembre-se de beber água ao longo do dia.",
    "Inclua frutas e verduras nas refeições.",
    "Prefira alimentos minimamente processados.",
    "Mantenha horários de refeição regulares.",
    "Mastigue com calma para melhor digestão.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 1));
    }, 300);

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="flex-1" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="mb-10 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {type === "loading-history" ? (
            <ClipboardList className="w-8 h-8" strokeWidth={1.75} />
          ) : (
            <Map className="w-8 h-8" strokeWidth={1.75} />
          )}
        </div>

        <div className="w-full max-w-sm mb-6">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-2 text-xs font-medium tabular-nums text-muted-foreground">{Math.round(progress)}%</p>
        </div>

        <div className="text-center mb-8">
          {type === "loading-history" ? (
            <>
              <h2 className="app-screen-title mb-2">Carregando seus menus</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">Buscando seu histórico de planos alimentares.</p>
            </>
          ) : (
            <>
              <h2 className="app-screen-title mb-2">Gerando sua jornada</h2>
              <p className="text-muted-foreground text-sm leading-relaxed px-1">
                Estamos gerando sua jornada personalizada com base nos seus dados e objetivos.
              </p>
              <p className="text-muted-foreground/80 text-xs mt-3">Isso pode levar de 20 a 30 segundos.</p>
            </>
          )}
        </div>

        <div className="w-full max-w-sm app-card p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-foreground/90 text-sm leading-relaxed">{tips[currentTip]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuLoadingScreen;
