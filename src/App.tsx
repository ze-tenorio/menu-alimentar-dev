import { useState } from "react";
import TransitionScreen from "./components/TransitionScreen";
import MenuAlimentarScreen from "./components/MenuAlimentarScreen";
import MenuAlimentarForm from "./components/MenuAlimentarForm";
import MenuLoadingScreen from "./components/MenuLoadingScreen";
import GeneratedMenuScreen from "./components/GeneratedMenuScreen";
import MenusListScreen from "./components/MenusListScreen";
import ShoppingListScreen from "./components/ShoppingListScreen";
import CpfEntryScreen from "./components/CpfEntryScreen";
import { generateMenu, MenuPlan } from "./services/menuApi";
import { getMenuHistory, getMenuDetail, MenuSummary } from "./services/menuHistoryApi";

const App = () => {
  const [showTransition, setShowTransition] = useState(true);
  const [showMenuAlimentar, setShowMenuAlimentar] = useState(false);
  const [showCpfEntry, setShowCpfEntry] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showMenuLoading, setShowMenuLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'creating' | 'loading-history'>('creating');
  const [showGeneratedMenu, setShowGeneratedMenu] = useState(false);
  const [showMenusList, setShowMenusList] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [hasCreatedMenu, setHasCreatedMenu] = useState(false);
  const [userCpf, setUserCpf] = useState<string>('');
  const [historicalMenus, setHistoricalMenus] = useState<MenuSummary[]>([]);
  const [createdMenus, setCreatedMenus] = useState<Array<{
    id: string;
    title: string;
    objective: string;
    date: string;
    type: 'maintenance' | 'weight_loss' | 'muscle_gain';
    menuData?: MenuPlan;
  }>>([]);
  const [formData, setFormData] = useState<any>(null);
  const [currentMenu, setCurrentMenu] = useState<MenuPlan | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setShowMenuAlimentar(true);
  };

  const handleMenuAlimentarClose = () => {
    setShowMenuAlimentar(false);
  };

  const handleMenuFormOpen = () => {
    setShowMenuAlimentar(false);
    setShowMenuForm(true);
  };

  const handleViewMyMenus = () => {
    setShowMenuAlimentar(false);
    setShowCpfEntry(true);
  };

  const handleCpfEntryClose = () => {
    setShowCpfEntry(false);
    setShowMenuAlimentar(true);
  };

  const handleCpfSubmit = async (cpf: string) => {
    setUserCpf(cpf);
    setShowCpfEntry(false);
    setLoadingType('loading-history');
    setShowMenuLoading(true);
    
    try {
      // Buscar histórico de menus do usuário
      const result = await getMenuHistory(cpf);
      
      if (result.success) {
        setHistoricalMenus(result.menus);
        setShowMenuLoading(false);
        setShowMenusList(true);
      } else {
        alert('Erro ao buscar menus: ' + (result.error || 'Erro desconhecido'));
        setShowMenuLoading(false);
        setShowCpfEntry(true);
      }
    } catch (error) {
      alert('Erro ao buscar menus. Por favor, tente novamente.');
      setShowMenuLoading(false);
      setShowCpfEntry(true);
    }
  };

  const handleMenuFormClose = () => {
    setShowMenuForm(false);
    setShowMenuAlimentar(true);
  };

  const handleMenuFormComplete = async (payload: any) => {
    setFormData(payload);
    setShowMenuForm(false);
    setLoadingType('creating');
    setShowMenuLoading(true);
    setApiError(null);
    
    try {
      // Chamar API para gerar o menu (pode levar 20-30 segundos)
      const result = await generateMenu(payload);
      
      if (result.success && result.plan) {
        setCurrentMenu(result.plan);
        // Avançar para a tela de menu gerado
        handleMenuLoadingComplete();
      } else {
        setApiError(result.error || 'Erro desconhecido ao gerar menu');
        // Voltar para o formulário em caso de erro
        alert('Erro ao gerar menu: ' + (result.error || 'Erro desconhecido'));
        setShowMenuLoading(false);
        setShowMenuForm(true);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Erro desconhecido');
      alert('Erro ao gerar menu. Por favor, tente novamente.');
      setShowMenuLoading(false);
      setShowMenuForm(true);
    }
  };

  const handleMenuLoadingComplete = () => {
    setShowMenuLoading(false);
    setShowGeneratedMenu(true);
    setHasCreatedMenu(true);
    
    // Adicionar menu à lista
    const objective = formData?.nutritional_plan_goals?.primary_objective || 'manutencao';
    const newMenu = {
      id: currentMenu?.plan_id || Date.now().toString(),
      title: `Menu ${getObjectiveText(objective)}`,
      objective: getObjectiveText(objective),
      date: new Date().toLocaleDateString('pt-BR'),
      type: getObjectiveType(objective) as 'maintenance' | 'weight_loss' | 'muscle_gain',
      menuData: currentMenu || undefined
    };
    setCreatedMenus(prev => [...prev, newMenu]);
  };

  const handleMenuLoadingBack = () => {
    setShowMenuLoading(false);
    setShowMenuForm(true);
  };

  const handleGeneratedMenuClose = () => {
    setShowGeneratedMenu(false);
  };

  const handleGeneratedMenuBack = async () => {
    setShowGeneratedMenu(false);
    
    // Se tem CPF, recarregar histórico para mostrar o novo menu
    if (userCpf) {
      setLoadingType('loading-history');
      setShowMenuLoading(true);
      
      try {
        const result = await getMenuHistory(userCpf);
        
        if (result.success) {
          setHistoricalMenus(result.menus);
          setShowMenuLoading(false);
          setShowMenusList(true);
        } else {
          setShowMenuLoading(false);
          setShowMenusList(true);
        }
      } catch (error) {
        setShowMenuLoading(false);
        setShowMenusList(true);
      }
    } else {
      setShowMenusList(true);
    }
  };

  const handleViewMenus = () => {
    setShowMenuAlimentar(false);
    setShowCpfEntry(true);
  };

  const handleMenusListClose = () => {
    setShowMenusList(false);
    setUserCpf('');
    setHistoricalMenus([]);
  };

  const handleMenusListBack = () => {
    setShowMenusList(false);
    setShowMenuAlimentar(true);
    setUserCpf('');
    setHistoricalMenus([]);
  };

  const handleCreateNewMenu = () => {
    setShowMenusList(false);
    setShowMenuForm(true);
  };

  const handleViewMenu = async (menuId: string) => {
    // Primeiro tenta encontrar nos menus criados nesta sessão
    const localMenu = createdMenus.find(m => m.id === menuId);
    if (localMenu) {
      setFormData({ 
        nutritional_plan_goals: { 
          primary_objective: getObjectiveId(localMenu.type) 
        } 
      });
      setCurrentMenu(localMenu.menuData || null);
      setShowMenusList(false);
      setShowGeneratedMenu(true);
      return;
    }
    
    // Se não encontrou localmente, é um menu histórico - buscar da API
    if (!userCpf) {
      alert('Erro: CPF não encontrado. Por favor, tente novamente.');
      return;
    }
    
    setShowMenusList(false);
    setLoadingType('loading-history');
    setShowMenuLoading(true);
    
    try {
      const result = await getMenuDetail(userCpf, menuId);
      
      if (result.success && result.plan) {
        setCurrentMenu(result.plan);
        setShowMenuLoading(false);
        setShowGeneratedMenu(true);
      } else {
        alert('Erro ao carregar menu: ' + (result.error || 'Erro desconhecido'));
        setShowMenuLoading(false);
        setShowMenusList(true);
      }
    } catch (error) {
      alert('Erro ao carregar menu. Por favor, tente novamente.');
      setShowMenuLoading(false);
      setShowMenusList(true);
    }
  };

  const handleShowShoppingList = () => {
    setShowGeneratedMenu(false);
    setShowShoppingList(true);
  };

  const handleShoppingListClose = () => {
    setShowShoppingList(false);
  };

  const handleShoppingListBack = () => {
    setShowShoppingList(false);
    setShowGeneratedMenu(true);
  };

  const handleShowWorkoutPlan = () => {
    // Placeholder - não implementado no projeto isolado
    alert('Funcionalidade de plano de treino não disponível neste projeto isolado');
  };

  const getObjectiveText = (objective: string) => {
    switch (objective) {
      case 'emagrecimento':
        return 'Perda de Peso e Definição';
      case 'ganho_de_peso':
        return 'Ganho de Peso e Massa Muscular';
      case 'manutencao':
        return 'Manutenção de Peso e Saúde Geral';
      // Manter compatibilidade com valores antigos
      case 'emagrecer':
        return 'Perda de Peso e Definição';
      case 'ganhar-peso':
        return 'Ganho de Peso e Massa Muscular';
      case 'manter-peso':
        return 'Manutenção de Peso e Saúde Geral';
      default:
        return 'Manutenção de Peso e Saúde Geral';
    }
  };

  const getObjectiveType = (objective: string) => {
    switch (objective) {
      case 'emagrecimento':
        return 'weight_loss';
      case 'ganho_de_peso':
        return 'muscle_gain';
      case 'manutencao':
        return 'maintenance';
      // Manter compatibilidade com valores antigos
      case 'emagrecer':
        return 'weight_loss';
      case 'ganhar-peso':
        return 'muscle_gain';
      case 'manter-peso':
        return 'maintenance';
      default:
        return 'maintenance';
    }
  };

  const getObjectiveId = (type: string) => {
    switch (type) {
      case 'weight_loss':
        return 'emagrecer';
      case 'muscle_gain':
        return 'ganhar-peso';
      default:
        return 'manter-peso';
    }
  };

  if (showTransition) {
    return <TransitionScreen onComplete={handleTransitionComplete} title="Menu Alimentar" />;
  }

  if (showMenuAlimentar) {
    return (
      <MenuAlimentarScreen 
        onClose={handleMenuAlimentarClose} 
        onStartForm={handleMenuFormOpen} 
        onViewMenus={handleViewMenus} 
        hasCreatedMenu={hasCreatedMenu} 
        menuCount={createdMenus.length}
      />
    );
  }

  if (showCpfEntry) {
    return <CpfEntryScreen onClose={handleCpfEntryClose} onSubmit={handleCpfSubmit} />;
  }

  if (showMenuForm) {
    return <MenuAlimentarForm onClose={handleMenuFormClose} onComplete={handleMenuFormComplete} initialCpf={userCpf} />;
  }

  if (showMenuLoading) {
    // MenuLoadingScreen não chama onComplete automaticamente
    // Só avançamos quando a API retornar
    return <MenuLoadingScreen onComplete={() => {}} onBack={handleMenuLoadingBack} type={loadingType} />;
  }

  if (showGeneratedMenu) {
    const objective = formData?.nutritional_plan_goals?.primary_objective || formData?.objective || 'manutencao';
    const currentObjective = getObjectiveText(objective);
    return (
      <GeneratedMenuScreen 
        onClose={handleGeneratedMenuClose} 
        onBack={handleGeneratedMenuBack} 
        onViewMenus={handleViewMenus} 
        onShowShoppingList={handleShowShoppingList} 
        onShowWorkoutPlan={handleShowWorkoutPlan} 
        objective={currentObjective}
        menuData={currentMenu}
      />
    );
  }

  if (showMenusList) {
    // Se tiver menus históricos, usar eles; senão, usar menus criados nesta sessão
    const menusToShow = historicalMenus.length > 0 
      ? historicalMenus.map(menu => ({
          id: menu.id,
          title: menu.title,
          objective: menu.objective,
          date: menu.date,
          type: menu.type,
          daily_energy_kcal: menu.daily_energy_kcal,
          current_weight: menu.current_weight,
          age: menu.age
        }))
      : createdMenus;
      
    return (
      <MenusListScreen 
        onClose={handleMenusListClose} 
        onBack={handleMenusListBack} 
        onCreateNew={handleCreateNewMenu} 
        onViewMenu={handleViewMenu} 
        menus={menusToShow} 
      />
    );
  }

  if (showShoppingList) {
    return (
      <ShoppingListScreen 
        onClose={handleShoppingListClose} 
        onBack={handleShoppingListBack} 
      />
    );
  }

  return null;
};

export default App;

