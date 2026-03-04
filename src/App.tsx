import { useState, useEffect } from "react";
import WelcomeBannerScreen from "./components/WelcomeBannerScreen";
import TransitionScreen from "./components/TransitionScreen";
import HomeScreen from "./components/HomeScreen";
import MenuAlimentarForm from "./components/MenuAlimentarForm";
import MenuLoadingScreen from "./components/MenuLoadingScreen";
import GeneratedMenuScreen from "./components/GeneratedMenuScreen";
import MenusListScreen from "./components/MenusListScreen";
import CpfEntryScreen from "./components/CpfEntryScreen";
import { generateMenu, MenuPlan } from "./services/menuApi";
import { getMenuHistory, getMenuDetail, MenuSummary } from "./services/menuHistoryApi";

const App = () => {
  // Carregar CPF salvo do sessionStorage ao iniciar
  const getSavedCpf = () => {
    try {
      return sessionStorage.getItem('userCpf') || '';
    } catch (error) {
      return '';
    }
  };

  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [showMenuAlimentar, setShowMenuAlimentar] = useState(false);
  const [showCpfEntry, setShowCpfEntry] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showMenuLoading, setShowMenuLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'creating' | 'loading-history'>('creating');
  const [showGeneratedMenu, setShowGeneratedMenu] = useState(false);
  const [showMenusList, setShowMenusList] = useState(false);
  const [hasCreatedMenu, setHasCreatedMenu] = useState(false);
  const [isMenuNewlyGenerated, setIsMenuNewlyGenerated] = useState(false);
  const [userCpf, setUserCpf] = useState<string>(getSavedCpf());
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

  const handleWelcomeBannerContinue = () => {
    setShowWelcomeBanner(false);
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setShowCpfEntry(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("userCpf");
    } catch (_) {}
    setUserCpf("");
    setShowMenuAlimentar(false);
    setShowCpfEntry(true);
  };

  const handleMenuAlimentarClose = () => {
    setShowMenuAlimentar(false);
  };

  const handleMenuFormOpen = () => {
    setShowMenuAlimentar(false);
    setShowMenuForm(true);
  };

  const handleViewMyMenus = async () => {
    setShowMenuAlimentar(false);
    
    // Se já tem CPF salvo, buscar menus diretamente
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
          // Se falhar, pedir CPF novamente
          setShowMenuLoading(false);
          setShowCpfEntry(true);
        }
      } catch (error) {
        setShowMenuLoading(false);
        setShowCpfEntry(true);
      }
    } else {
      // Se não tem CPF salvo, pedir
      setShowCpfEntry(true);
    }
  };

  const handleCpfEntryClose = () => {
    setShowCpfEntry(false);
    setShowTransition(true);
  };

  const handleCpfSubmit = async (cpf: string) => {
    // Salvar CPF no sessionStorage
    try {
      sessionStorage.setItem('userCpf', cpf);
    } catch (error) {
      console.error('Erro ao salvar CPF no sessionStorage:', error);
    }
    
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
        setShowMenuAlimentar(true);
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
    setIsMenuNewlyGenerated(true); // Marca como recém-gerado para mostrar CSAT
    
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

  const handleViewMenus = async () => {
    setShowMenuAlimentar(false);
    
    // Se já tem CPF salvo, buscar menus diretamente
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
          setShowCpfEntry(true);
        }
      } catch (error) {
        setShowMenuLoading(false);
        setShowCpfEntry(true);
      }
    } else {
      setShowCpfEntry(true);
    }
  };

  const handleMenusListClose = () => {
    setShowMenusList(false);
    setHistoricalMenus([]);
  };

  const handleMenusListBack = () => {
    setShowMenusList(false);
    setShowMenuAlimentar(true);
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
      setIsMenuNewlyGenerated(false); // Não é recém-gerado, está visualizando histórico
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
        // Extrair objetivo do plano retornado pela API
        const planObjective = result.plan.nutritional_guidelines_detailed?.objective || 
                              result.plan.objective || 
                              'manutencao';
        
        // Setar formData com o objetivo correto
        setFormData({ 
          nutritional_plan_goals: { 
            primary_objective: planObjective
          } 
        });
        
        setCurrentMenu(result.plan);
        setShowMenuLoading(false);
        setIsMenuNewlyGenerated(false); // Carregando do histórico, não é recém-gerado
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


  const getObjectiveText = (objective: string) => {
    switch (objective) {
      case 'emagrecimento':
        return '🔻 Emagrecimento';
      case 'ganho_massa':
        return '🔺 Ganho de Massa';
      case 'manutencao':
        return '⚖️ Manutenção';
      // Manter compatibilidade com valores antigos
      case 'ganho_de_peso':
        return '🔺 Ganho de Massa';
      case 'emagrecer':
        return '🔻 Emagrecimento';
      case 'ganhar-peso':
        return '🔺 Ganho de Massa';
      case 'manter-peso':
        return '⚖️ Manutenção';
      // Valores em inglês que a API pode retornar
      case 'weight_loss':
        return '🔻 Emagrecimento';
      case 'muscle_gain':
        return '🔺 Ganho de Massa';
      case 'maintenance':
        return '⚖️ Manutenção';
      default:
        return '⚖️ Manutenção';
    }
  };

  const getObjectiveType = (objective: string) => {
    switch (objective) {
      case 'emagrecimento':
        return 'weight_loss';
      case 'ganho_massa':
        return 'muscle_gain';
      case 'manutencao':
        return 'maintenance';
      // Manter compatibilidade com valores antigos
      case 'ganho_de_peso':
        return 'muscle_gain';
      case 'emagrecer':
        return 'weight_loss';
      case 'ganhar-peso':
        return 'muscle_gain';
      case 'manter-peso':
        return 'maintenance';
      // Valores em inglês que a API pode retornar (já estão no formato correto)
      case 'weight_loss':
        return 'weight_loss';
      case 'muscle_gain':
        return 'muscle_gain';
      case 'maintenance':
        return 'maintenance';
      default:
        return 'maintenance';
    }
  };

  // Pré-carregar histórico na Home quando há CPF para exibir "Últimos menus"
  useEffect(() => {
    if (!showMenuAlimentar || !userCpf) return;
    getMenuHistory(userCpf).then((result) => {
      if (result.success && result.menus.length > 0) {
        setHistoricalMenus(result.menus);
      }
    });
  }, [showMenuAlimentar, userCpf]);

  const getObjectiveId = (type: string) => {
    switch (type) {
      case 'weight_loss':
        return 'emagrecimento';
      case 'muscle_gain':
        return 'ganho_massa';
      case 'maintenance':
        return 'manutencao';
      default:
        return 'manutencao';
    }
  };

  if (showWelcomeBanner) {
    return <WelcomeBannerScreen onContinue={handleWelcomeBannerContinue} />;
  }

  if (showTransition) {
    return <TransitionScreen onComplete={handleTransitionComplete} title="Menu Alimentar" />;
  }

  if (showMenuAlimentar) {
    const recentMenus = historicalMenus.length > 0
      ? historicalMenus.map((m) => ({
          id: m.id,
          title: m.title,
          objective: m.objective,
          date: m.date,
          type: m.type,
          daily_energy_kcal: m.daily_energy_kcal,
          current_weight: m.current_weight,
          age: m.age,
        }))
      : createdMenus;
    return (
      <HomeScreen
        onGenerateMenu={handleMenuFormOpen}
        onViewMenus={handleViewMenus}
        onViewMenu={handleViewMenu}
        onLogout={handleLogout}
        recentMenus={recentMenus}
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
        objective={currentObjective}
        menuData={currentMenu}
        isNewlyGenerated={isMenuNewlyGenerated}
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

  return null;
};

export default App;

