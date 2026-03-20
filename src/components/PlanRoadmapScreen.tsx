import React, { useMemo } from "react";
import { Check, CheckCircle2, ChevronRight, Map } from "lucide-react";

export type RoadmapStepAction =
  | "view_menu"
  | "checkin"
  | "nutri"
  | "endocrino"
  | "generate_menu"
  | "recipes"
  | "progress_eval";
export type RoadmapStepStatus = "completed" | "current" | "remaining";

export interface RoadmapStep {
  id: string;
  title: string;
  subtitle: string;
  /** Texto extra (ex.: lembrete de que o toque abre o menu) */
  accessNote?: string;
  action: RoadmapStepAction;
  expReward: number;
}

interface PlanRoadmapScreenProps {
  level: number;
  exp: number;
  steps: RoadmapStep[];
  stepStates: Record<string, "completed" | "skipped">;
  onDoStep: (stepId: string) => void;
  onViewMenusList: () => void;
  onLevelUp: () => void;
  embedded?: boolean;
}

const PlanRoadmapScreen: React.FC<PlanRoadmapScreenProps> = ({
  level,
  exp,
  steps,
  stepStates,
  onDoStep,
  onViewMenusList,
  onLevelUp,
  embedded = false,
}) => {
  const statusByStep = useMemo(() => {
    const firstPending = steps.find((s) => !stepStates[s.id])?.id;
    const output: Record<string, RoadmapStepStatus> = {};
    steps.forEach((s) => {
      if (stepStates[s.id]) output[s.id] = "completed";
      else if (s.id === firstPending) output[s.id] = "current";
      else output[s.id] = "remaining";
    });
    return output;
  }, [steps, stepStates]);

  const allResolved = steps.length > 0 && steps.every((s) => !!stepStates[s.id]);

  const stepRowClass = (status: RoadmapStepStatus) => {
    const base =
      "w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    if (status === "completed") return `${base} border-border bg-muted/30`;
    if (status === "current") return `${base} border-border bg-card border-l-[3px] border-l-primary pl-[13px]`;
    return `${base} border-border bg-card hover:bg-muted/20`;
  };

  const renderStepIndicator = (status: RoadmapStepStatus, index: number) => {
    if (status === "completed") {
      return (
        <div
          className="w-9 h-9 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
          aria-hidden
        >
          <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
        </div>
      );
    }
    if (status === "current") {
      return (
        <div
          className="w-9 h-9 rounded-full border-2 border-primary text-primary font-semibold text-sm flex items-center justify-center shrink-0 mt-0.5 tabular-nums"
          aria-hidden
        >
          {index + 1}
        </div>
      );
    }
    return (
      <div
        className="w-9 h-9 rounded-full border border-border text-muted-foreground font-medium text-sm flex items-center justify-center shrink-0 mt-0.5 tabular-nums bg-muted/40"
        aria-hidden
      >
        {index + 1}
      </div>
    );
  };

  return (
    <div className={`${embedded ? "h-full" : "fixed inset-0 z-50"} bg-background flex flex-col`}>
      <div className="flex-1 overflow-y-auto p-4 pb-24 max-w-lg mx-auto w-full">
        <p className="app-muted-label mb-1">Sua jornada</p>
        <h1 className="app-screen-title mb-1">Nível {level}</h1>
        <p className="text-sm text-muted-foreground mb-5">Acompanhe cada etapa no seu ritmo.</p>

        <div className="w-full bg-muted rounded-full h-1.5 mb-5 overflow-hidden">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-700 relative overflow-hidden"
            style={{
              width: `${Math.min(100, Math.round((Object.keys(stepStates).length / Math.max(1, steps.length)) * 100))}%`,
            }}
          >
            <div className="absolute inset-0 -translate-x-full bg-white/10 animate-[shimmer_8s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="app-card p-4 mb-6 flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Map className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Nível {level}
              <span className="text-muted-foreground font-normal"> · </span>
              <span className="text-primary tabular-nums">{exp} EXP</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Você está indo bem. Conclua a etapa em destaque quando for conveniente.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 mb-6">
          {steps.map((step, index) => {
            const status = statusByStep[step.id];
            return (
              <div key={step.id} className="relative">
                <button type="button" onClick={() => onDoStep(step.id)} className={stepRowClass(status)}>
                  {renderStepIndicator(status, index)}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p
                      className={`font-medium text-sm leading-snug ${status === "current" ? "text-foreground" : "text-foreground/90"}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{step.subtitle}</p>
                    {step.accessNote ? (
                      <p className="text-primary font-medium text-xs mt-2">{step.accessNote}</p>
                    ) : null}
                    <p className="text-xs mt-1.5 text-muted-foreground tabular-nums">+{step.expReward} EXP</p>
                  </div>
                  {status === "completed" ? (
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-1 opacity-80" strokeWidth={2} />
                  ) : (
                    <ChevronRight size={18} className="text-muted-foreground shrink-0 mt-1" strokeWidth={2} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-2 mb-6">
          <div className="border-t border-dashed border-border w-full mb-4" aria-hidden />
          <p className="app-muted-label text-center mb-2">Renova ciclo</p>
          <p className="text-center text-sm text-muted-foreground leading-relaxed px-1">
            Complete o nível acima para estender ou renovar o seu plano e obter novas ações.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewMenusList}
          className="w-full py-3 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted/50 transition-colors mb-3"
        >
          Ver todos os menus
        </button>

        {allResolved && (
          <button
            type="button"
            onClick={onLevelUp}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-95 transition-opacity"
          >
            Concluir semana e subir de nível
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanRoadmapScreen;
