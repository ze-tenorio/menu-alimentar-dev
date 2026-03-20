import React from 'react';
import { ArrowLeft, Plus, Calendar, Target, Scale, Flame, User, TrendingDown, Dumbbell } from 'lucide-react';

interface Menu {
  id: string;
  title: string;
  objective: string;
  date: string;
  type: 'maintenance' | 'weight_loss' | 'muscle_gain';
  daily_energy_kcal?: number;
  current_weight?: number;
  age?: number;
}

interface MenusListScreenProps {
  onClose: () => void;
  onBack: () => void;
  onCreateNew: () => void;
  onViewMenu: (menuId: string) => void;
  menus: Menu[];
}

const MenusListScreen: React.FC<MenusListScreenProps> = ({
  onClose: _onClose,
  onBack,
  onCreateNew,
  onViewMenu,
  menus,
}) => {
  const getObjectiveIcon = (type: string) => {
    const c = 'w-6 h-6 text-primary';
    switch (type) {
      case 'weight_loss':
        return <TrendingDown className={c} strokeWidth={2} />;
      case 'muscle_gain':
        return <Dumbbell className={c} strokeWidth={2} />;
      default:
        return <Target className={c} strokeWidth={2} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <h1 className="text-sm font-medium text-foreground">Meus menus</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        <div className="space-y-3 mb-6">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              onClick={() => onViewMenu(menu.id)}
              className="app-card w-full text-left p-4 transition-colors hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {getObjectiveIcon(menu.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base mb-1 truncate">{menu.title}</h3>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <Calendar size={12} className="mr-1 shrink-0" strokeWidth={2} />
                    {menu.date}
                  </div>
                </div>
                <span className="text-primary text-xs font-medium shrink-0 pt-1">Abrir</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                {menu.age !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">
                      <User size={12} className="mr-1" />
                      Idade
                    </div>
                    <span className="text-foreground font-medium text-xs tabular-nums">{menu.age} anos</span>
                  </div>
                )}
                {menu.current_weight !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">
                      <Scale size={12} className="mr-1" />
                      Peso
                    </div>
                    <span className="text-foreground font-medium text-xs tabular-nums">{menu.current_weight} kg</span>
                  </div>
                )}
                {menu.daily_energy_kcal !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">
                      <Flame size={12} className="mr-1" />
                      Calorias
                    </div>
                    <span className="text-foreground font-medium text-xs tabular-nums">
                      {menu.daily_energy_kcal.toLocaleString('pt-BR')} kcal
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {menus.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4 text-primary">
              <Target className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <h3 className="app-screen-title mb-2">Nenhum menu ainda</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Crie seu primeiro plano alimentar personalizado.
            </p>
            <div className="w-12 h-0.5 bg-primary/20 rounded-full mx-auto" />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <button
          type="button"
          onClick={onCreateNew}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-medium text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
        >
          <Plus size={22} strokeWidth={2} />
          Criar novo menu
        </button>
      </div>
    </div>
  );
};

export default MenusListScreen;
