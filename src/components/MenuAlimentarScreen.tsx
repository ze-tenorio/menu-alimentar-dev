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
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 flex items-center justify-between px-4 py-3">
        <div className="w-6"></div> {/* Spacer */}
        <h1 className="text-white text-lg font-semibold">TotalPass</h1>
        <div className="w-6"></div> {/* Spacer para manter centralização */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 py-8 pb-12">
        {/* TotalPass Benefícios Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo TP.png" 
              alt="TotalPass Logo"
              className="w-48 h-48 object-contain"
            />
          </div>
          <div className="text-center">
            <span className="text-primary text-xl font-semibold">Benefícios</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-6">
          <h2 className="text-gray-800 text-2xl font-bold mb-3">Olá!</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Crie seu menu alimentar inteligente e comece sua jornada de bem-estar
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 w-full max-w-md mb-6">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white text-lg">🧠</span>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-sm mb-2">
                Menu Inteligente TotalPass
              </h3>
              <p className="text-blue-700 text-xs leading-relaxed">
                Nosso sistema analisa seu <strong>perfil nutricional</strong> e seu <strong>padrão de treinos</strong> extraído do seu histórico na TotalPass para criar um plano totalmente compatível com sua rotina, gostos e objetivos.
              </p>
            </div>
          </div>
        </div>


        {/* Action Card */}
        <div className="bg-gray-50 rounded-xl p-6 w-full max-w-sm">
          <h3 className="text-gray-800 text-lg font-bold text-center mb-4">
            Comece sua jornada
          </h3>
          
          {/* Steps */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">
                Análise completa: perfil nutricional + histórico de treinos
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">
                Menu personalizado compatível com sua rotina
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onViewMenus}
              className="w-full bg-white border-2 border-primary text-primary py-4 px-6 rounded-lg font-semibold text-base flex items-center justify-center hover:bg-primary/5 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ver Meus Menus
            </button>
            
            <button 
              onClick={onStartForm}
              className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold text-base flex items-center justify-center hover:bg-primary/90 transition-colors"
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

