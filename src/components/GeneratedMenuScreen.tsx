import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, ChevronDown } from 'lucide-react';
import { MenuPlan } from '../services/menuApi';
import CsatModal from './CsatModal';
import { submitCsatEvaluation, isPlanEvaluated } from '../services/csatApi';

interface GeneratedMenuScreenProps {
  onClose: () => void;
  onBack: () => void;
  onGoHome?: () => void;
  onViewRoadmap?: () => void;
  onViewMenus: () => void;
  objective?: string;
  menuData?: MenuPlan | null;
  isNewlyGenerated?: boolean; // Indica se o menu acabou de ser gerado
}

const GeneratedMenuScreen: React.FC<GeneratedMenuScreenProps> = ({ 
  onClose, 
  onBack, 
  onGoHome,
  onViewRoadmap,
  onViewMenus,
  objective,
  menuData: apiMenuData,
  isNewlyGenerated = false
}) => {
  const [showCsatModal, setShowCsatModal] = useState(false);
  const [csatDismissed, setCsatDismissed] = useState(false);
  const [firstInteractionTime, setFirstInteractionTime] = useState<number | null>(null);
  const [hasScrolled80Percent, setHasScrolled80Percent] = useState(false);
  const [expandedMealIndices, setExpandedMealIndices] = useState<Set<number>>(new Set());
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const toggleMeal = (index: number) => {
    setExpandedMealIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Função para verificar se pode mostrar CSAT
  const canShowCsat = () => {
    if (!isNewlyGenerated || csatDismissed || showCsatModal) return false;
    const planId = apiMenuData?.plan_id;
    if (planId && isPlanEvaluated(planId)) return false;
    return true;
  };

  // Detectar primeira interação (scroll, click, touch)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isNewlyGenerated || firstInteractionTime) return;

    const handleFirstInteraction = () => {
      if (!firstInteractionTime) {
        setFirstInteractionTime(Date.now());
      }
    };

    // Detectar qualquer tipo de interação
    container.addEventListener('scroll', handleFirstInteraction);
    container.addEventListener('click', handleFirstInteraction);
    container.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      container.removeEventListener('scroll', handleFirstInteraction);
      container.removeEventListener('click', handleFirstInteraction);
      container.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isNewlyGenerated, firstInteractionTime]);

  // Detectar scroll >= 80% da página
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isNewlyGenerated || hasScrolled80Percent) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // Calcula a porcentagem de scroll
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      if (scrollPercentage >= 80 && !hasScrolled80Percent) {
        setHasScrolled80Percent(true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isNewlyGenerated, hasScrolled80Percent]);

  // Timer: 40 segundos após primeira interação
  useEffect(() => {
    if (!firstInteractionTime || !canShowCsat()) return;

    const timer = setTimeout(() => {
      if (canShowCsat()) {
        setShowCsatModal(true);
      }
    }, 40000); // 40 segundos após primeira interação

    return () => clearTimeout(timer);
  }, [firstInteractionTime, csatDismissed, isNewlyGenerated, apiMenuData?.plan_id]);

  // Timer: 5 segundos após scroll >= 80%
  useEffect(() => {
    if (!hasScrolled80Percent || !canShowCsat()) return;

    const timer = setTimeout(() => {
      if (canShowCsat()) {
        setShowCsatModal(true);
      }
    }, 5000); // 5 segundos após atingir 80%

    return () => clearTimeout(timer);
  }, [hasScrolled80Percent, csatDismissed, isNewlyGenerated, apiMenuData?.plan_id]);

  const handleCsatClose = () => {
    setShowCsatModal(false);
    setCsatDismissed(true);
  };

  const handleCsatSubmit = async (rating: number, feedback: string) => {
    const planId = apiMenuData?.plan_id || '';
    // Usar patient_id do menu ou CPF salvo no sessionStorage
    const patientId = apiMenuData?.patient_id || apiMenuData?.user_id || sessionStorage.getItem('userCpf') || '';
    
    if (!planId || !patientId) {
      console.error('[CSAT] Dados obrigatórios faltando:', { planId, patientId });
      return;
    }
    
    await submitCsatEvaluation(planId, rating, feedback, patientId);
  };
  // Função para obter a ordem de uma refeição
  const getMealOrder = (meal: any): number => {
    // Pega type ou name e converte para lowercase, remove acentos
    const mealText = (meal.type || meal.name || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    // Verificar por palavras-chave (mais robusto)
    if (mealText.includes('breakfast') || mealText.includes('cafe') || mealText.includes('manha')) {
      return 1; // Café da manhã
    }
    if (mealText.includes('morning') || (mealText.includes('lanche') && mealText.includes('manha'))) {
      return 2; // Lanche da manhã
    }
    if (mealText.includes('lunch') || mealText.includes('almoco')) {
      return 3; // Almoço
    }
    if (mealText.includes('afternoon') || (mealText.includes('lanche') && mealText.includes('tarde'))) {
      return 4; // Lanche da tarde
    }
    if (mealText.includes('dinner') || mealText.includes('jantar')) {
      return 5; // Jantar
    }
    if (mealText.includes('supper') || mealText.includes('ceia')) {
      return 6; // Ceia
    }
    
    // Se não encontrou nada, coloca no final
    return 999;
  };

  // Converter meals de objeto para array se necessário e ordenar
  const mealsArray = apiMenuData?.meals 
    ? (() => {
        let meals = Array.isArray(apiMenuData.meals)
          ? apiMenuData.meals
          : Object.values(apiMenuData.meals).filter(meal => meal !== null && meal !== undefined);
        
        // Ordenar meals pela ordem correta
        return meals.sort((a, b) => getMealOrder(a) - getMealOrder(b));
      })()
    : [];
  
  // Verificar se temos dados reais da API
  const hasApiData = apiMenuData && mealsArray.length > 0;
  
  const defaultMenuData = {
    objective: objective || "Manutenção de Peso e Saúde Geral",
    date: "16/09/2025",
    sections: [
      {
        title: "Líquidos",
        items: [
          { name: "2,5 L de água/dia", quantity: "2,5 L", alternatives: [] }
        ]
      },
      {
        title: "Suplementos",
        items: [
          { name: "Multivitamínico (opcional)", quantity: "1 unidade", alternatives: [] }
        ]
      },
      {
        title: "Café da manhã",
        instruction: "Escolher uma opção de cada grupo",
        groups: [
          {
            name: "Carboidratos",
            description: "Torrada integral (2 unidades) OU pão de forma integral (1 fatia) OU tapioca (3 colheres)",
            quantity: "2 unidades OU 1 fatia OU 3 colheres",
            alternatives: ["torrada integral", "pão integral", "tapioca"]
          },
          {
            name: "Proteínas",
            description: "Queijo fresco (1 fatia de 1 dedo)",
            quantity: "1 fatia",
            alternatives: ["queijo fresco", "cottage", "ricota"]
          },
          {
            name: "Frutas",
            description: "Fruta (1 porção. Ex: banana prata, ou maça, pera-1 unidade)",
            quantity: "1 porção",
            alternatives: ["banana prata", "maça", "pera", "abacate"]
          }
        ]
      },
      {
        title: "Almoço",
        instruction: "Escolher uma opção de cada grupo",
        groups: [
          {
            name: "Folhas",
            description: "Folhas à vontade 40% do prato alface, couve etc",
            quantity: "40% do prato",
            alternatives: ["alface", "couve", "repolho", "rúcula"]
          },
          {
            name: "Legumes",
            description: "Legumes: cenoura, brócolis, beterraba, abobrinha (3 colheres de sopa) OU tomate (3 rodelas)",
            quantity: "3 colheres OU 3 rodelas",
            alternatives: ["cenoura", "brócolis", "beterraba", "abobrinha", "tomate"]
          },
          {
            name: "Carboidratos",
            description: "Carboidratos: arroz branco/integral (4 colheres); batata/purê (3 colheres); abóbora (3 colheres); milho (3 colheres)",
            quantity: "4 colheres OU 3 colheres",
            alternatives: ["arroz branco", "arroz integral", "batata", "purê", "abóbora", "milho"]
          },
          {
            name: "Leguminosas",
            description: "feijão/ ervilha (1/2 concha); lentilha (3 colheres); grão de bico (2 colheres)",
            quantity: "1/2 concha OU 3 colheres OU 2 colheres",
            alternatives: ["feijão", "ervilha", "lentilha", "grão de bico"]
          },
          {
            name: "Proteínas",
            description: "ovo (1 unidade) OU frango (1 filé pequeno)",
            quantity: "1 unidade OU 1 filé",
            alternatives: ["ovo cozido", "frango grelhado", "peixe"]
          }
        ]
      },
      {
        title: "Lanche da tarde",
        instruction: "Escolher uma opção de cada grupo",
        groups: [
          {
            name: "Frutas",
            description: "Fruta (1 porção) OU iogurte natural (1 pote)",
            quantity: "1 porção OU 1 pote",
            alternatives: ["banana", "maça", "iogurte natural", "queijo"]
          }
        ]
      },
      {
        title: "Jantar",
        instruction: "Escolher uma opção de cada grupo",
        groups: [
          {
            name: "Folhas",
            description: "Folhas à vontade (preferencialmente verdes escuras-40% do prato)",
            quantity: "40% do prato",
            alternatives: ["alface", "couve", "espinafre", "rúcula"]
          },
          {
            name: "Legumes",
            description: "Legumes: cenoura, berinjela, abobrinha, pepino, beterraba, tomate etc (4 colheres de sopa)",
            quantity: "4 colheres",
            alternatives: ["cenoura", "berinjela", "abobrinha", "pepino", "beterraba", "tomate"]
          },
          {
            name: "Proteínas",
            description: "Proteínas: peixe (1 filé) OU frango (1 filé) OU ovo (2 unidades)",
            quantity: "1 filé OU 2 unidades",
            alternatives: ["peixe grelhado", "frango grelhado", "ovo cozido"]
          }
        ]
      }
    ],
    observations: [
      "Evitar beber líquidos durante as refeições, especialmente refrigerante e suco de caixinha",
      "Avaliar a função intestinal (número de evacuações/semana e consistência das fezes)",
      "Analisar todas as melhoras, facilidades e dificuldades que teve com o menu alimentar",
      "Caso tenha aversão à algum alimento, não é necessário comer",
      "Caso tenha algum alimento que queira consumir ou consultar a respectiva quantidade, anotar para a próxima consulta"
    ],
    recommendations: [
      "Antes de qualquer coisa, veja como será sua rotina (se vai sair muitas vezes, se vai levar lanche, se vai comer fora)",
      "Depois de visualizar sua semana, escolha as preparações que irá fazer. Para não sobrecarregar, escolha 2 tipos de cada grupo alimentar",
      "Não é preciso refeições gourmet com ingredientes difíceis de usar e que tomem muito tempo na cozinha",
      "Escolhidos os pratos, é a hora de escrever uma lista de ingredientes",
      "Compre utensílios que te ajudem a armazenar comida: bolsa térmica, marmita, cubo de gelo reutilizável"
    ]
  };

  // Renderizar dados da API
  const renderApiMealData = () => {
    if (!apiMenuData) return null;

    return (
      <>
        {/* Informações nutricionais */}
        {apiMenuData.macros && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Informações Nutricionais</h3>
            <div className="bg-muted/40 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-sm">Calorias Diárias</p>
                  <p className="text-foreground font-semibold">{apiMenuData.daily_energy_kcal} kcal</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Proteínas</p>
                  <p className="text-foreground font-semibold">{apiMenuData.macros.protein_g.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Carboidratos</p>
                  <p className="text-foreground font-semibold">{apiMenuData.macros.carbs_g.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Gorduras</p>
                  <p className="text-foreground font-semibold">{apiMenuData.macros.fat_g.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações nutricionais */}
        {apiMenuData.nutritional_guidelines_detailed && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Recomendações</h3>
            <div className="bg-muted/40 rounded-lg p-4 space-y-2">
              <p className="text-foreground/90 text-sm">
                <span className="font-semibold">Hidratação:</span> {apiMenuData.nutritional_guidelines_detailed.fluids}
              </p>
              {apiMenuData.nutritional_guidelines_detailed.supplements && (
                <p className="text-foreground/90 text-sm">
                  <span className="font-semibold">Suplementos:</span> {apiMenuData.nutritional_guidelines_detailed.supplements}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Refeições expansíveis */}
        {mealsArray.map((meal, mealIndex) => {
          const isExpanded = expandedMealIndices.has(mealIndex);
          return (
            <div key={mealIndex} className="mb-3 border border-border rounded-lg overflow-hidden bg-card">
              <button
                type="button"
                onClick={() => toggleMeal(mealIndex)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
                aria-expanded={isExpanded}
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground">{meal.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">Meta: {meal.target_kcal} kcal</p>
                </div>
                <ChevronDown
                  size={22}
                  className={`text-muted-foreground flex-shrink-0 ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              {isExpanded && meal.items && meal.items.length > 0 && (
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                  <p className="text-muted-foreground text-sm mb-3 italic">Escolha uma opção abaixo:</p>
                  {meal.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-card rounded-lg p-4 mb-3 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">{item.name}</h4>
                      <p className="text-foreground/90 text-sm mb-3 whitespace-pre-line">{item.description}</p>
                      {item.portion && (
                        <div className="bg-muted rounded-lg p-3 mb-2">
                          <p className="text-foreground/90 font-medium text-sm">{item.portion}</p>
                        </div>
                      )}
                      {item.alternatives && item.alternatives.length > 0 && (
                        <div className="mt-2">
                          <p className="text-muted-foreground text-xs font-semibold mb-1">Substituições:</p>
                          {item.alternatives.map((alt, altIndex) => (
                            <p key={altIndex} className="text-muted-foreground text-xs ml-2">• {alt}</p>
                          ))}
                        </div>
                      )}
                      {item.notes && (
                        <p className="text-muted-foreground text-xs mt-2 italic">{item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground p-1 rounded-md" aria-label="Voltar">
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <h1 className="text-sm font-medium text-foreground">Menu</h1>
        {onGoHome ? (
          <button type="button" onClick={onGoHome} className="text-muted-foreground hover:text-foreground p-1 rounded-md" aria-label="Ir para início">
            <Home size={22} strokeWidth={2} />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className="bg-background border-b border-border px-5 py-5 shrink-0 max-w-2xl mx-auto w-full">
        <div>
          <p className="app-muted-label mb-1">Plano</p>
          <h2 className="app-screen-title mb-2">Menu alimentar</h2>
          <p className="text-muted-foreground text-sm">
            Objetivo: {objective || defaultMenuData.objective}
          </p>
          {onViewRoadmap && (
            <button type="button" onClick={onViewRoadmap} className="mt-3 text-primary font-medium text-sm hover:underline underline-offset-2">
              Ver jornada
            </button>
          )}
          {apiMenuData?.nutritional_guidelines_detailed?.patient_name && (
            <p className="text-muted-foreground text-xs mt-2">
              Paciente: {apiMenuData.nutritional_guidelines_detailed.patient_name}
            </p>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-5 max-w-2xl mx-auto w-full">
          {/* Renderizar dados da API */}
          {hasApiData ? (
            renderApiMealData()
          ) : (
            /* Mensagem de erro se não houver dados da API */
            <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
              <h3 className="app-screen-title mb-2">Aguardando dados do menu</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O menu ainda não está disponível. Volte e tente novamente.
              </p>
            </div>
          )}
          
          {/* Dados de exemplo (removidos - não devem aparecer mais) */}
          {false && (
            <>
              {/* Menu Sections (Dados de exemplo) */}
              {defaultMenuData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">{section.title}</h3>
              
              {section.instruction && (
                <p className="text-muted-foreground text-sm mb-4">{section.instruction}</p>
              )}

              {/* Simple items (like liquids, supplements) */}
              {section.items && section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-muted/40 rounded-lg p-4 mb-3">
                  <p className="text-foreground">{item.name}</p>
                </div>
              ))}

              {/* Food groups */}
              {section.groups && section.groups.map((group, groupIndex) => (
                <div key={groupIndex} className="bg-muted/40 rounded-lg p-4 mb-3">
                  <h4 className="font-semibold text-foreground mb-2">{group.name}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{group.description}</p>
                  
                  <div className="bg-muted rounded-lg p-3 mb-2">
                    <p className="text-foreground/90 font-medium">{group.quantity}</p>
                  </div>
                  
                  <p className="text-muted-foreground text-xs">
                    Alternativas: {group.alternatives.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ))}

              {/* Observations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Observações</h3>
                {defaultMenuData.observations.map((observation, index) => (
                  <div key={index} className="bg-muted/40 rounded-lg p-4 mb-3">
                    <p className="text-foreground/90 text-sm">{observation}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Recomendações</h3>
                {defaultMenuData.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-muted/40 rounded-lg p-4 mb-3">
                    <p className="text-foreground/90 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Fechar bloco de dados de exemplo */}

          {/* Nutritionist Info - sempre exibir */}
          {hasApiData && (
          <div className="mb-6">
            <div className="rounded-lg border border-border bg-primary/5 p-5">
              <p className="text-foreground/90 text-sm leading-relaxed text-center">
                A partir do plano <strong className="font-semibold">TP3</strong> é possível fazer um acompanhamento com um profissional de nutrição da <strong className="font-semibold">Starbem</strong> para te ajudar a alcançar seus objetivos de forma personalizada e eficaz.*
              </p>
            </div>
            <p className="text-muted-foreground text-[10px] leading-tight mt-2 text-center px-2">
              * Disponibilidade sujeita à contratação pelo RH. O serviço pode não estar disponível para todos os usuários.
            </p>
          </div>
          )}
        </div>
      </div>

      {/* CSAT Modal */}
      <CsatModal
        isOpen={showCsatModal}
        onClose={handleCsatClose}
        onSubmit={handleCsatSubmit}
        planId={apiMenuData?.plan_id}
      />
    </div>
  );
};

export default GeneratedMenuScreen;
