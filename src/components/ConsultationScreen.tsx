import React from "react";
import { ArrowLeft, CalendarPlus, ChefHat, Stethoscope, TrendingUp } from "lucide-react";

export type ConsultationKind = "nutri" | "endocrino" | "recipes" | "progress_eval";

interface ConsultationScreenProps {
  type: ConsultationKind;
  title?: string;
  description?: string;
  readOnly?: boolean;
  onBack: () => void;
  onSkip?: () => void;
  onComplete: () => void;
}

const defaultCopy: Record<ConsultationKind, { title: string; desc: string; icon: React.ReactNode }> = {
  nutri: {
    title: "Consulta com nutricionista",
    desc: "Agende sua consulta para ajustes no plano e evolução semanal.",
    icon: <CalendarPlus className="text-primary" size={24} strokeWidth={2} />,
  },
  endocrino: {
    title: "Consulta com endocrino",
    desc: "Agende sua consulta para acompanhamento clínico da jornada.",
    icon: <Stethoscope className="text-primary" size={24} strokeWidth={2} />,
  },
  recipes: {
    title: "Receitas e recomendações",
    desc: "Acompanhe as receitas do seu plano e as recomendações personalizadas para manter o ritmo.",
    icon: <ChefHat className="text-primary" size={24} strokeWidth={2} />,
  },
  progress_eval: {
    title: "Avaliação de progresso",
    desc: "Revise seus resultados para estender ou renovar o plano e liberar novas ações na jornada.",
    icon: <TrendingUp className="text-primary" size={24} strokeWidth={2} />,
  },
};

const ConsultationScreen: React.FC<ConsultationScreenProps> = ({
  type,
  title: titleProp,
  description: descProp,
  readOnly = false,
  onBack,
  onSkip,
  onComplete,
}) => {
  const defaults = defaultCopy[type];
  const title = titleProp ?? defaults.title;
  const desc = descProp ?? defaults.desc;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground p-1 rounded-md" aria-label="Voltar">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <h1 className="text-sm font-medium text-foreground">Jornada</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="app-card p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-4">{defaults.icon}</div>
          <h2 className="app-screen-title mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          <span className="inline-flex mt-4 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Simulação de agendamento</span>
        </div>
      </div>

      {!readOnly && (
        <div className="p-4 border-t border-border bg-background shrink-0 space-y-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted/50 transition-colors"
            >
              Pular etapa
            </button>
          )}
          <button
            type="button"
            onClick={onComplete}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-95 transition-opacity"
          >
            Marcar como concluído
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultationScreen;
