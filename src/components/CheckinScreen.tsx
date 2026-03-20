import React, { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { MenuPlan } from "../services/menuApi";

interface CheckinScreenProps {
  title: string;
  menuData: MenuPlan | null;
  readOnly?: boolean;
  initialSelectedItems?: string[];
  onBack: () => void;
  onOpenMenu: () => void;
  onSkip?: () => void;
  onComplete: (selectedItems: string[]) => void;
}

const CheckinScreen: React.FC<CheckinScreenProps> = ({
  title,
  menuData,
  readOnly = false,
  initialSelectedItems = [],
  onBack,
  onOpenMenu,
  onSkip,
  onComplete,
}) => {
  const checklist = useMemo(() => {
    if (!menuData?.meals) return [];
    const mealsArray = Array.isArray(menuData.meals) ? menuData.meals : Object.values(menuData.meals).filter(Boolean);
    return mealsArray.map((meal: any, idx: number) => ({
      id: `meal-${idx}`,
      label: `${meal.name || meal.type || `Refeição ${idx + 1}`} (${meal.target_kcal || "-"} kcal)`,
    }));
  }, [menuData]);

  const [checked, setChecked] = useState<Record<string, boolean>>(
    initialSelectedItems.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );

  const toggle = (id: string) => {
    if (readOnly) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selected = checklist.filter((i) => checked[i.id]).map((i) => i.id);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground p-1 rounded-md" aria-label="Voltar">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <h1 className="text-sm font-medium text-foreground">Check-in</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        <p className="app-muted-label mb-1">Registro</p>
        <h2 className="app-screen-title">{title}</h2>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          {readOnly ? "Visualização do check-in já concluído." : "Marque o que você conseguiu seguir do menu de hoje."}
        </p>

        <button type="button" onClick={onOpenMenu} className="mt-4 text-primary font-medium text-sm hover:underline underline-offset-2">
          Ver menu da etapa
        </button>

        <div className="mt-5 space-y-2">
          {checklist.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground leading-relaxed">
              Nenhum menu encontrado. Gere ou abra um menu antes do check-in.
            </div>
          ) : (
            checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  checked[item.id] ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <span className="text-sm text-foreground">{item.label}</span>
                {checked[item.id] && <Check size={18} className="text-primary shrink-0" strokeWidth={2.5} />}
              </button>
            ))
          )}
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
            onClick={() => onComplete(selected)}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-95 transition-opacity"
          >
            Concluir check-in
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckinScreen;
