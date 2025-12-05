import React from 'react';
import { ArrowLeft, Plus, Calendar, Target, Scale, Flame, User } from 'lucide-react';

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
  onClose, 
  onBack, 
  onCreateNew, 
  onViewMenu,
  menus
}) => {

  const getObjectiveIcon = (type: string) => {
    switch (type) {
      case 'weight_loss':
        return '📉';
      case 'muscle_gain':
        return '💪';
      default:
        return '⚖️';
    }
  };

  const getObjectiveColor = (type: string) => {
    switch (type) {
      case 'weight_loss':
        return 'text-red-600';
      case 'muscle_gain':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-primary flex items-center justify-between px-4 py-3">
        <button onClick={onBack} className="text-primary-foreground hover:text-primary-foreground/80">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-primary-foreground text-lg font-semibold">Meus Menus</h1>
        <div className="w-6"></div> {/* Spacer para manter centralização */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Menus List */}
        <div className="space-y-4 mb-6">
          {menus.map((menu) => (
            <div 
              key={menu.id}
              onClick={() => onViewMenu(menu.id)}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <span className="text-3xl mr-3">{getObjectiveIcon(menu.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{menu.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-1" />
                      {menu.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-primary text-sm font-medium underline">
                    Ver menu completo
                  </span>
                </div>
              </div>

              {/* Informações do Plano */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                {menu.age !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <User size={14} className="mr-1" />
                      <span>Idade</span>
                    </div>
                    <span className="text-gray-800 font-semibold text-sm">{menu.age} anos</span>
                  </div>
                )}
                
                {menu.current_weight !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <Scale size={14} className="mr-1" />
                      <span>Peso</span>
                    </div>
                    <span className="text-gray-800 font-semibold text-sm">{menu.current_weight} kg</span>
                  </div>
                )}
                
                {menu.daily_energy_kcal !== undefined && (
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <Flame size={14} className="mr-1" />
                      <span>Calorias</span>
                    </div>
                    <span className="text-gray-800 font-semibold text-sm">
                      {menu.daily_energy_kcal.toLocaleString('pt-BR')} kcal
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {menus.length === 0 && (
          <div className="text-center py-12 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Você ainda não criou um menu alimentar</h3>
            <p className="text-gray-600 text-base mb-6">
              Crie agora mesmo clicando no botão abaixo!
            </p>
            <div className="w-16 h-1 bg-primary/20 rounded-full mx-auto"></div>
          </div>
        )}
      </div>

      {/* Footer - Create New Button */}
      <div className="p-6 border-t border-gray-200">
        <button 
          onClick={onCreateNew}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus size={24} className="mr-2" />
          Criar Novo Menu
        </button>
      </div>
    </div>
  );
};

export default MenusListScreen;
