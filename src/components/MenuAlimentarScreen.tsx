import React from 'react';
import { Plus } from 'lucide-react';

interface MenuAlimentarScreenProps {
  onClose: () => void;
  onStartForm: () => void;
  onViewMenus: () => void;
  hasCreatedMenu: boolean;
  menuCount: number;
}

const MenuAlimentarScreen: React.FC<MenuAlimentarScreenProps> = ({ 
  onClose, 
  onStartForm,
  onViewMenus,
  hasCreatedMenu,
  menuCount
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 py-8 pb-12">
        {/* TotalPass Logo */}
        <div className="mb-8 mt-8">
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/logo-totalpass-new.png" 
              alt="TotalPass Logo"
              className="w-64 h-auto object-contain mb-3"
            />
            {/* Powered by Starbem */}
            <div className="flex items-center justify-center opacity-50">
              <span className="text-muted-foreground text-xs mr-2">powered by</span>
              <img 
                src="/logo-starbem.png" 
                alt="Starbem"
                className="h-4 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-6">
          <h2 className="app-screen-title mb-2">Olá!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Crie seu menu alimentar inteligente e comece sua jornada de bem-estar
          </p>
        </div>


        {/* Action Card */}
        <div className="app-card p-6 w-full max-w-sm bg-muted/30">
          <h3 className="text-foreground text-base font-semibold text-center mb-4">
            Comece sua jornada
          </h3>
          
          {/* Steps */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-foreground/90 text-sm">
                Análise completa de perfil nutricional
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-foreground/90 text-sm">
                Menu personalizado compatível com sua rotina
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onViewMenus}
              className="w-full bg-card border border-primary text-primary py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-primary/5 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ver Meus Menus
            </button>
            
            <button 
              onClick={onStartForm}
              className="w-full bg-primary text-primary-foreground py-3.5 px-6 rounded-lg font-medium text-sm flex items-center justify-center hover:opacity-95 transition-opacity"
            >
              <Plus size={20} className="mr-2" />
              Criar Novo Menu
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MenuAlimentarScreen;

