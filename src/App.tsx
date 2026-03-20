import { useState, useEffect } from "react";
import WelcomeBannerScreen from "./components/WelcomeBannerScreen";
import TransitionScreen from "./components/TransitionScreen";
import HomeScreen from "./components/HomeScreen";
import PlanRoadmapScreen from "./components/PlanRoadmapScreen";
import CheckinScreen from "./components/CheckinScreen";
import ConsultationScreen, { type ConsultationKind } from "./components/ConsultationScreen";
import ProfileScreen from "./components/ProfileScreen";
import MenuAlimentarForm from "./components/MenuAlimentarForm";
import MenuLoadingScreen from "./components/MenuLoadingScreen";
import GeneratedMenuScreen from "./components/GeneratedMenuScreen";
import MenusListScreen from "./components/MenusListScreen";
import CpfEntryScreen from "./components/CpfEntryScreen";
import { generateMenu, MenuPlan } from "./services/menuApi";
import { getMenuHistory, getMenuDetail, MenuSummary } from "./services/menuHistoryApi";
import { RoadmapStep } from "./components/PlanRoadmapScreen";
import { Home, Map, User, Flame, Star } from "lucide-react";

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
  const [showPlanRoadmap, setShowPlanRoadmap] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [consultationType, setConsultationType] = useState<ConsultationKind>("nutri");
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
  const [activeRoadmapStepId, setActiveRoadmapStepId] = useState<string | null>(null);
  const [activeRoadmapStepReadOnly, setActiveRoadmapStepReadOnly] = useState(false);
  const [checkinByStepId, setCheckinByStepId] = useState<Record<string, string[]>>({});
  const [stepMenuByStepId, setStepMenuByStepId] = useState<Record<string, string>>({});
  const [journeyLevel, setJourneyLevel] = useState(1);
  const [journeyExp, setJourneyExp] = useState(0);
  const [activeDays] = useState(7);
  const [roadmapStepStates, setRoadmapStepStates] = useState<Record<string, "completed" | "skipped">>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const getOnboardingKey = (cpf: string) => `menuJourneyOnboardingDone:${cpf}`;
  const isOnboardingDoneForCpf = (cpf: string) => {
    if (!cpf) return false;
    try {
      return sessionStorage.getItem(getOnboardingKey(cpf)) === "1";
    } catch (_) {
      return false;
    }
  };
  const setOnboardingDoneForCpf = (cpf: string) => {
    if (!cpf) return;
    try {
      sessionStorage.setItem(getOnboardingKey(cpf), "1");
    } catch (_) {}
  };

  const getRoadmapStorageKey = (cpf: string) => `roadmapState:${cpf}`;
  const getRoadmapStepsForLevel = (level: number): RoadmapStep[] => [
    {
      id: `l${level}-s1-menu`,
      title: "Gerar menu",
      subtitle: "Crie ou revise o plano alimentar deste ciclo.",
      accessNote: "Toque aqui para abrir o seu menu personalizado",
      action: "view_menu",
      expReward: 120,
    },
    {
      id: `l${level}-s2-nutri`,
      title: "Consulta com nutricionista",
      subtitle: "Alinhe objetivos, dúvidas e ajustes iniciais do plano.",
      action: "nutri",
      expReward: 140,
    },
    {
      id: `l${level}-s3-checkin`,
      title: "Check-in",
      subtitle: "Registre como foi sua adesão ao menu neste período.",
      action: "checkin",
      expReward: 80,
    },
    {
      id: `l${level}-s4-recipes`,
      title: "Acompanhar receita e recomendações",
      subtitle: "Veja sugestões práticas alinhadas ao seu plano.",
      action: "recipes",
      expReward: 100,
    },
    {
      id: `l${level}-s5-nutri-return`,
      title: "Retorno com nutricionista",
      subtitle: "Avalie evolução e próximos ajustes com a nutri.",
      action: "nutri",
      expReward: 140,
    },
    {
      id: `l${level}-s6-checkin`,
      title: "Check-in",
      subtitle: "Mais um registro para manter o acompanhamento.",
      action: "checkin",
      expReward: 80,
    },
    {
      id: `l${level}-s7-progress`,
      title: "Avaliação de progresso — estender ou renovar o plano",
      subtitle: "Revise resultados e decida se segue com o plano atual ou inicia um novo ciclo.",
      action: "progress_eval",
      expReward: 180,
    },
  ];

  const roadmapSteps = getRoadmapStepsForLevel(journeyLevel);

  const persistRoadmapState = (cpf: string, level: number, exp: number, stepStates: Record<string, "completed" | "skipped">) => {
    if (!cpf) return;
    try {
      sessionStorage.setItem(
        getRoadmapStorageKey(cpf),
        JSON.stringify({
          level,
          exp,
          stepStates,
          stepMenuByStepId,
          checkinByStepId,
        })
      );
    } catch (_) {}
  };

  const loadRoadmapState = (cpf: string) => {
    if (!cpf) return;
    try {
      const raw = sessionStorage.getItem(getRoadmapStorageKey(cpf));
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setJourneyLevel(parsed.level || 1);
      setJourneyExp(parsed.exp || 0);
      const lvl = parsed.level || 1;
      const validIds = new Set(getRoadmapStepsForLevel(lvl).map((s) => s.id));
      const rawStates = parsed.stepStates || {};
      const stepStates = Object.fromEntries(
        Object.entries(rawStates).filter(([id]) => validIds.has(id))
      ) as Record<string, "completed" | "skipped">;
      setRoadmapStepStates(stepStates);
      setStepMenuByStepId(parsed.stepMenuByStepId || {});
      setCheckinByStepId(parsed.checkinByStepId || {});
    } catch (_) {}
  };

  useEffect(() => {
    if (!userCpf) return;
    loadRoadmapState(userCpf);
  }, [userCpf]);

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
    setShowPlanRoadmap(false);
    setShowProfile(false);
    setShowCpfEntry(true);
  };

  const handleMenuAlimentarClose = () => {
    setShowMenuAlimentar(false);
  };

  const handleMenuFormOpen = () => {
    setShowMenuAlimentar(false);
    setShowPlanRoadmap(false);
    setShowMenuForm(true);
  };

  const handleOpenRoadmap = () => {
    setShowProfile(false);
    setShowMenuAlimentar(false);
    setShowPlanRoadmap(true);
  };

  const handleRoadmapBack = () => {
    setShowProfile(false);
    setShowPlanRoadmap(false);
    setShowMenuAlimentar(true);
  };

  const openHomeTab = () => {
    setShowProfile(false);
    setShowPlanRoadmap(false);
    setShowMenuAlimentar(true);
  };

  const openJourneyTab = () => {
    setShowProfile(false);
    setShowMenuAlimentar(false);
    setShowPlanRoadmap(true);
  };

  const openProfileTab = () => {
    setShowMenuAlimentar(false);
    setShowPlanRoadmap(false);
    setShowProfile(true);
  };

  const markRoadmapStep = (stepId: string, status: "completed" | "skipped") => {
    const step = roadmapSteps.find((s) => s.id === stepId);
    if (!step) return;
    if (roadmapStepStates[stepId]) return;
    const gain = status === "completed" ? step.expReward : Math.round(step.expReward * 0.35);
    const nextExp = journeyExp + gain;
    const nextStates = { ...roadmapStepStates, [stepId]: status };
    setJourneyExp(nextExp);
    setRoadmapStepStates(nextStates);
    persistRoadmapState(userCpf, journeyLevel, nextExp, nextStates);
  };

  const handleDoRoadmapStep = async (stepId: string) => {
    const step = roadmapSteps.find((s) => s.id === stepId);
    if (!step) return;
    const isResolved = !!roadmapStepStates[stepId];
    setActiveRoadmapStepId(stepId);
    setActiveRoadmapStepReadOnly(isResolved);

    if (step.action === "view_menu") {
      if (!isResolved) markRoadmapStep(stepId, "completed");
      await handleOpenLatestMenu();
      return;
    }

    if (step.action === "generate_menu") {
      if (isResolved) {
        await handleOpenLatestMenu();
      } else {
        handleMenuFormOpen();
      }
      return;
    }

    if (step.action === "checkin") {
      setShowPlanRoadmap(false);
      setShowCheckin(true);
      return;
    }

    if (step.action === "nutri" || step.action === "endocrino" || step.action === "recipes" || step.action === "progress_eval") {
      setConsultationType(step.action);
      setShowPlanRoadmap(false);
      setShowConsultation(true);
    }
  };

  const handleSkipRoadmapStep = (stepId: string) => {
    if (roadmapStepStates[stepId]) return;
    markRoadmapStep(stepId, "skipped");
  };

  const handleCheckinComplete = (selectedItems: string[]) => {
    if (activeRoadmapStepId) {
      setCheckinByStepId((prev) => ({ ...prev, [activeRoadmapStepId]: selectedItems }));
      markRoadmapStep(activeRoadmapStepId, "completed");
    }
    setShowCheckin(false);
    setShowPlanRoadmap(true);
  };

  const handleConsultationComplete = () => {
    if (activeRoadmapStepId) {
      markRoadmapStep(activeRoadmapStepId, "completed");
    }
    setShowConsultation(false);
    setShowPlanRoadmap(true);
  };

  const handleLevelUp = () => {
    const allResolved = roadmapSteps.every((s) => !!roadmapStepStates[s.id]);
    if (!allResolved) {
      alert("Conclua ou pule todas as etapas da semana para subir de nivel.");
      return;
    }
    const nextLevel = journeyLevel + 1;
    const bonusExp = journeyExp + 300;
    setJourneyLevel(nextLevel);
    setJourneyExp(bonusExp);
    setRoadmapStepStates({});
    persistRoadmapState(userCpf, nextLevel, bonusExp, {});
    alert(`Parabens! Voce subiu para o nivel ${nextLevel}. Gere o novo menu da semana.`);
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
    loadRoadmapState(cpf);
    setShowCpfEntry(false);
    setLoadingType('loading-history');
    setShowMenuLoading(true);
    
    try {
      // Buscar histórico de menus do usuário
      const result = await getMenuHistory(cpf);
      
      if (result.success) {
        setHistoricalMenus(result.menus);
        setShowMenuLoading(false);
        if (result.menus.length === 0 && !isOnboardingDoneForCpf(cpf)) {
          setShowMenuForm(true);
        } else {
          setShowMenuAlimentar(true);
        }
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
    const payloadCpf = payload?.request_metadata?.patient_id || userCpf;
    setOnboardingDoneForCpf(payloadCpf);
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
        handleMenuLoadingComplete(result.plan, payload);
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

  const handleMenuLoadingComplete = (generatedPlan?: MenuPlan, generatedPayload?: any) => {
    const resolvedPlan = generatedPlan || currentMenu;
    const objective =
      generatedPayload?.nutritional_plan_goals?.primary_objective ||
      formData?.nutritional_plan_goals?.primary_objective ||
      "manutencao";

    setShowMenuLoading(false);
    setShowPlanRoadmap(true);
    setShowMenuAlimentar(false);
    setHasCreatedMenu(true);
    setIsMenuNewlyGenerated(true); // Marca como recém-gerado para mostrar CSAT
    if (resolvedPlan) setCurrentMenu(resolvedPlan);
    
    // Adicionar menu à lista
    const newMenu = {
      id: resolvedPlan?.plan_id || Date.now().toString(),
      title: `Menu ${getObjectiveText(objective)}`,
      objective: getObjectiveText(objective),
      date: new Date().toLocaleDateString('pt-BR'),
      type: getObjectiveType(objective) as 'maintenance' | 'weight_loss' | 'muscle_gain',
      menuData: resolvedPlan || undefined
    };
    setCreatedMenus(prev => [...prev, newMenu]);

    const activeStep = activeRoadmapStepId;
    if (activeStep) {
      const mapped = { ...stepMenuByStepId, [activeStep]: newMenu.id };
      setStepMenuByStepId(mapped);
      if (!roadmapStepStates[activeStep]) {
        markRoadmapStep(activeStep, "completed");
      }
      persistRoadmapState(userCpf, journeyLevel, journeyExp, { ...roadmapStepStates });
    } else {
      const firstStepId = roadmapSteps[0]?.id;
      if (firstStepId) {
        const mapped = { ...stepMenuByStepId, [firstStepId]: newMenu.id };
        setStepMenuByStepId(mapped);
      }
    }
  };

  const handleMenuLoadingBack = () => {
    setShowMenuLoading(false);
    setShowMenuForm(true);
  };

  const handleGeneratedMenuClose = () => {
    setShowGeneratedMenu(false);
  };

  const handleGeneratedMenuGoHome = () => {
    setShowGeneratedMenu(false);
    setShowMenuAlimentar(true);
  };

  const handleGeneratedMenuGoRoadmap = () => {
    setShowGeneratedMenu(false);
    setShowPlanRoadmap(true);
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

  const handleOpenLatestMenu = async () => {
    // Regra principal: sempre tentar pegar o ultimo menu do CPF na API
    if (userCpf) {
      try {
        const historyResult = await getMenuHistory(userCpf);
        if (historyResult.success && historyResult.menus.length > 0) {
          setHistoricalMenus(historyResult.menus);
          const latestMenuId = historyResult.menus[0].id;
          await handleViewMenu(latestMenuId);
          return;
        }
      } catch (error) {
        // Fallback abaixo
      }
    }

    // Fallback local se API indisponivel
    const latestHistorical = historicalMenus[0];
    if (latestHistorical) {
      await handleViewMenu(latestHistorical.id);
      return;
    }
    const latestCreated = createdMenus[createdMenus.length - 1];
    if (latestCreated) {
      await handleViewMenu(latestCreated.id);
      return;
    }
    handleMenuFormOpen();
  };

  const handleViewMenu = async (menuId: string) => {
    setShowMenuAlimentar(false);
    setShowPlanRoadmap(false);
    setShowMenusList(false);

    // Primeiro tenta encontrar nos menus criados nesta sessão
    const localMenu = createdMenus.find(m => m.id === menuId);
    if (localMenu) {
      setFormData({ 
        nutritional_plan_goals: { 
          primary_objective: getObjectiveId(localMenu.type) 
        } 
      });
      setCurrentMenu(localMenu.menuData || null);
      setIsMenuNewlyGenerated(false); // Não é recém-gerado, está visualizando histórico
      setShowGeneratedMenu(true);
      return;
    }
    
    // Se não encontrou localmente, é um menu histórico - buscar da API
    if (!userCpf) {
      alert('Erro: CPF não encontrado. Por favor, tente novamente.');
      setShowMenuAlimentar(true);
      return;
    }
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
        return 'Emagrecimento';
      case 'ganho_massa':
        return 'Ganho de massa';
      case 'manutencao':
        return 'Manutenção';
      case 'ganho_de_peso':
        return 'Ganho de massa';
      case 'emagrecer':
        return 'Emagrecimento';
      case 'ganhar-peso':
        return 'Ganho de massa';
      case 'manter-peso':
        return 'Manutenção';
      case 'weight_loss':
        return 'Emagrecimento';
      case 'muscle_gain':
        return 'Ganho de massa';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Manutenção';
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

  if (showMenuAlimentar || showPlanRoadmap || showProfile) {
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
    const activeTab: "home" | "journey" | "profile" = showProfile ? "profile" : showPlanRoadmap ? "journey" : "home";
    const menusGenerated = historicalMenus.length > 0 ? historicalMenus.length : createdMenus.length;
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <header className="min-h-11 shrink-0 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-foreground font-medium">
          <div className="inline-flex items-center gap-2 min-w-0">
            <Star size={14} className="text-primary shrink-0 opacity-90" strokeWidth={2} />
            <span className="truncate tabular-nums">Nível {journeyLevel}</span>
          </div>
          <span className="h-4 w-px bg-border shrink-0 hidden sm:block" aria-hidden />
          <div className="inline-flex items-center gap-2 min-w-0">
            <Flame size={14} className="text-primary shrink-0 opacity-90" strokeWidth={2} />
            <span className="truncate tabular-nums">{activeDays} dias</span>
          </div>
          <span className="h-4 w-px bg-border shrink-0 hidden sm:block" aria-hidden />
          <div className="inline-flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" aria-hidden />
            <span className="truncate tabular-nums">{journeyExp} EXP</span>
          </div>
        </header>

        <main className="flex-1 min-h-0 app-shell-main overflow-hidden">
          {activeTab === "home" && (
            <HomeScreen
              embedded
              onGenerateMenu={handleMenuFormOpen}
              onOpenRoadmap={openJourneyTab}
              onViewMenus={handleViewMenus}
              onViewMenu={handleViewMenu}
              onLogout={handleLogout}
              recentMenus={recentMenus}
            />
          )}
          {activeTab === "journey" && (
            <PlanRoadmapScreen
              embedded
              level={journeyLevel}
              exp={journeyExp}
              steps={roadmapSteps}
              stepStates={roadmapStepStates}
              onDoStep={handleDoRoadmapStep}
              onViewMenusList={handleViewMenus}
              onLevelUp={handleLevelUp}
            />
          )}
          {activeTab === "profile" && (
            <ProfileScreen
              name={formData?.patient_profile?.full_name || "Usuário"}
              weight={formData?.patient_profile?.current_weight_kg ? `${formData.patient_profile.current_weight_kg} kg` : "--"}
              age={formData?.patient_profile?.age ? `${formData.patient_profile.age} anos` : "--"}
              activeDays={activeDays}
              exp={journeyExp}
              level={journeyLevel}
              menusGenerated={menusGenerated}
            />
          )}
        </main>

        <footer className="min-h-[52px] shrink-0 pb-[env(safe-area-inset-bottom,0px)] pt-1.5 border-t border-border bg-background/95 backdrop-blur-sm px-6 flex items-center justify-around">
          <button
            type="button"
            onClick={openHomeTab}
            className={`flex flex-col items-center gap-1 py-1.5 min-w-[4.5rem] text-xs font-medium transition-colors ${activeTab === "home" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Home size={22} strokeWidth={activeTab === "home" ? 2.25 : 1.75} />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={openJourneyTab}
            className={`flex flex-col items-center gap-1 py-1.5 min-w-[4.5rem] text-xs font-medium transition-colors ${activeTab === "journey" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Map size={22} strokeWidth={activeTab === "journey" ? 2.25 : 1.75} />
            <span>Jornada</span>
          </button>
          <button
            type="button"
            onClick={openProfileTab}
            className={`flex flex-col items-center gap-1 py-1.5 min-w-[4.5rem] text-xs font-medium transition-colors ${activeTab === "profile" ? "text-primary" : "text-muted-foreground"}`}
          >
            <User size={22} strokeWidth={activeTab === "profile" ? 2.25 : 1.75} />
            <span>Perfil</span>
          </button>
        </footer>
      </div>
    );
  }

  if (showCheckin) {
    const activeTitle = roadmapSteps.find((s) => s.id === activeRoadmapStepId)?.title || "Check-in";
    return (
      <CheckinScreen
        title={activeTitle}
        menuData={currentMenu}
        readOnly={activeRoadmapStepReadOnly}
        initialSelectedItems={activeRoadmapStepId ? checkinByStepId[activeRoadmapStepId] || [] : []}
        onBack={() => {
          setShowCheckin(false);
          setShowPlanRoadmap(true);
        }}
        onOpenMenu={handleOpenLatestMenu}
        onSkip={() => {
          if (activeRoadmapStepId) handleSkipRoadmapStep(activeRoadmapStepId);
          setShowCheckin(false);
          setShowPlanRoadmap(true);
        }}
        onComplete={handleCheckinComplete}
      />
    );
  }

  if (showConsultation) {
    const activeConsultStep = activeRoadmapStepId ? roadmapSteps.find((s) => s.id === activeRoadmapStepId) : undefined;
    return (
      <ConsultationScreen
        type={consultationType}
        title={activeConsultStep?.title}
        description={activeConsultStep?.subtitle}
        readOnly={activeRoadmapStepReadOnly}
        onBack={() => {
          setShowConsultation(false);
          setShowPlanRoadmap(true);
        }}
        onSkip={() => {
          if (activeRoadmapStepId) handleSkipRoadmapStep(activeRoadmapStepId);
          setShowConsultation(false);
          setShowPlanRoadmap(true);
        }}
        onComplete={handleConsultationComplete}
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
        onGoHome={handleGeneratedMenuGoHome}
        onViewRoadmap={handleGeneratedMenuGoRoadmap}
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

