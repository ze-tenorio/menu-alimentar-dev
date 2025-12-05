import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { MenuPlan } from '../services/menuApi';

interface GeneratedMenuScreenProps {
  onClose: () => void;
  onBack: () => void;
  onViewMenus: () => void;
  onShowShoppingList: () => void;
  onShowWorkoutPlan: () => void;
  objective?: string;
  menuData?: MenuPlan | null;
}

const GeneratedMenuScreen: React.FC<GeneratedMenuScreenProps> = ({ 
  onClose, 
  onBack, 
  onViewMenus,
  onShowShoppingList,
  onShowWorkoutPlan,
  objective,
  menuData: apiMenuData
}) => {
  // Converter meals de objeto para array se necessário
  const mealsArray = apiMenuData?.meals 
    ? Array.isArray(apiMenuData.meals)
      ? apiMenuData.meals
      : Object.values(apiMenuData.meals).filter(meal => meal !== null && meal !== undefined)
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
            <h3 className="text-lg font-bold text-gray-800 mb-3">Informações Nutricionais</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-600 text-sm">Calorias Diárias</p>
                  <p className="text-gray-800 font-semibold">{apiMenuData.daily_energy_kcal} kcal</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Proteínas</p>
                  <p className="text-gray-800 font-semibold">{apiMenuData.macros.protein_g.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Carboidratos</p>
                  <p className="text-gray-800 font-semibold">{apiMenuData.macros.carbs_g.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Gorduras</p>
                  <p className="text-gray-800 font-semibold">{apiMenuData.macros.fat_g.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendações nutricionais */}
        {apiMenuData.nutritional_guidelines_detailed && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Recomendações</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Hidratação:</span> {apiMenuData.nutritional_guidelines_detailed.fluids}
              </p>
              {apiMenuData.nutritional_guidelines_detailed.supplements && (
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Suplementos:</span> {apiMenuData.nutritional_guidelines_detailed.supplements}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Refeições */}
        {mealsArray.map((meal, mealIndex) => (
          <div key={mealIndex} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{meal.name}</h3>
            <p className="text-gray-600 text-sm mb-3">Meta: {meal.target_kcal} kcal</p>
            <p className="text-gray-600 text-sm mb-4 italic">Escolha uma opção abaixo:</p>
            
            {meal.items && meal.items.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-gray-50 rounded-lg p-4 mb-3">
                <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">{item.description}</p>
                
                {item.portion && (
                  <div className="bg-gray-200 rounded-lg p-3 mb-2">
                    <p className="text-gray-700 font-medium text-sm">{item.portion}</p>
                  </div>
                )}
                
                {item.alternatives && item.alternatives.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-600 text-xs font-semibold mb-1">Substituições:</p>
                    {item.alternatives.map((alt, altIndex) => (
                      <p key={altIndex} className="text-gray-600 text-xs ml-2">• {alt}</p>
                    ))}
                  </div>
                )}
                
                {item.notes && (
                  <p className="text-gray-500 text-xs mt-2 italic">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Meus Menus</h1>
        <div className="w-6"></div> {/* Spacer para manter centralização */}
      </div>

      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        {/* Title and Objective */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menu Alimentar</h2>
          <p className="text-gray-600">Objetivo: {objective || defaultMenuData.objective}</p>
          {apiMenuData?.nutritional_guidelines_detailed?.patient_name && (
            <p className="text-gray-500 text-sm mt-1">
              Paciente: {apiMenuData.nutritional_guidelines_detailed.patient_name}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-2">
          <button 
            onClick={onShowShoppingList}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart size={20} className="mr-2" />
            Lista de compras
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Renderizar dados da API */}
          {hasApiData ? (
            renderApiMealData()
          ) : (
            /* Mensagem de erro se não houver dados da API */
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Aguardando dados do menu...
              </h3>
              <p className="text-gray-600 text-sm">
                Parece que o menu ainda não foi gerado. Por favor, volte e tente novamente.
              </p>
            </div>
          )}
          
          {/* Dados de exemplo (removidos - não devem aparecer mais) */}
          {false && (
            <>
              {/* Menu Sections (Dados de exemplo) */}
              {defaultMenuData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{section.title}</h3>
              
              {section.instruction && (
                <p className="text-gray-600 text-sm mb-4">{section.instruction}</p>
              )}

              {/* Simple items (like liquids, supplements) */}
              {section.items && section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-800">{item.name}</p>
                </div>
              ))}

              {/* Food groups */}
              {section.groups && section.groups.map((group, groupIndex) => (
                <div key={groupIndex} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <h4 className="font-semibold text-gray-800 mb-2">{group.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  
                  <div className="bg-gray-200 rounded-lg p-3 mb-2">
                    <p className="text-gray-700 font-medium">{group.quantity}</p>
                  </div>
                  
                  <p className="text-gray-500 text-xs">
                    Alternativas: {group.alternatives.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ))}

              {/* Observations */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Observações</h3>
                {defaultMenuData.observations.map((observation, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-gray-700 text-sm">{observation}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Recomendações</h3>
                {defaultMenuData.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-gray-700 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Fechar bloco de dados de exemplo */}

          {/* Nutritionist CTA - sempre exibir */}
          {hasApiData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <h3 className="font-bold text-gray-800 mb-2">Acompanhe com um Nutricionista da Starbem</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tenha acompanhamento profissional personalizado para seus objetivos
            </p>
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold">
              Agendar Consulta
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedMenuScreen;
