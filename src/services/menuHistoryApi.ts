/**
 * Serviço de API para histórico de menus
 * 
 * Este arquivo contém as funções para buscar menus anteriores do usuário
 */

import { MenuPlan } from './menuApi';

/**
 * URLs da API - Produção
 */
const API_BASE_URL = 'https://kpg71puaqk.execute-api.us-east-2.amazonaws.com/prd';
const API_LIST_PLANS = `${API_BASE_URL}/list-plans`;
const API_GET_PLAN = `${API_BASE_URL}/get-plan`;

/**
 * API Key para autenticação
 */
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Formato do plano retornado pela API de histórico
 */
export interface HistoricalPlan {
  plan_id: string;
  created_at: string; // ISO format
  objective: 'emagrecimento' | 'ganho_massa' | 'ganho_de_peso' | 'manutencao' | 'weight_loss' | 'muscle_gain' | 'maintenance';
  current_weight: number;
  total_calories: number;
  age: number;
}

/**
 * Resposta da API de histórico
 */
export interface MenuHistoryApiResponse {
  success: boolean;
  patient_id: string;
  total_plans: number;
  plans: HistoricalPlan[];
  execution_id?: string;
  timestamp?: string;
}

/**
 * Formato usado internamente para exibir na lista
 */
export interface MenuSummary {
  id: string;
  patient_id: string;
  title: string;
  objective: string;
  date: string;
  type: 'maintenance' | 'weight_loss' | 'muscle_gain';
  daily_energy_kcal: number;
  created_at: string;
  current_weight: number;
  age: number;
}

export interface MenuHistoryResponse {
  success: boolean;
  menus: MenuSummary[];
  total: number;
  error?: string;
}

export interface MenuDetailResponse {
  success: boolean;
  plan?: MenuPlan;
  error?: string;
}

/**
 * Dados mock para testes - formato da API real
 */
const MOCK_API_RESPONSES: Record<string, MenuHistoryApiResponse> = {
  '12345678900': {
    success: true,
    patient_id: '12345678900',
    total_plans: 3,
    plans: [
          {
            plan_id: '550e8400-e29b-41d4-a716-446655440001',
            created_at: '2025-11-20T14:30:00.000000',
            objective: 'emagrecimento',
            current_weight: 85.5,
            total_calories: 1800.0,
            age: 35
          },
          {
            plan_id: '550e8400-e29b-41d4-a716-446655440002',
            created_at: '2025-11-15T09:15:00.000000',
            objective: 'manutencao',
            current_weight: 78.0,
            total_calories: 2200.0,
            age: 35
          },
          {
            plan_id: '550e8400-e29b-41d4-a716-446655440003',
            created_at: '2025-11-10T16:45:00.000000',
            objective: 'ganho_massa',
            current_weight: 72.0,
            total_calories: 2800.0,
            age: 34
          }
    ]
  },
  '98765432100': {
    success: true,
    patient_id: '98765432100',
    total_plans: 2,
    plans: [
          {
            plan_id: '550e8400-e29b-41d4-a716-446655440004',
            created_at: '2025-11-22T11:00:00.000000',
            objective: 'ganho_massa',
            current_weight: 65.0,
            total_calories: 3200.0,
            age: 28
          },
          {
            plan_id: '550e8400-e29b-41d4-a716-446655440005',
            created_at: '2025-11-18T08:30:00.000000',
            objective: 'emagrecimento',
            current_weight: 90.0,
            total_calories: 1600.0,
            age: 28
          }
    ]
  }
};

/**
 * Converte um plano da API para o formato de exibição
 */
function convertPlanToSummary(plan: HistoricalPlan, patientId: string): MenuSummary {
  const objectiveMap: Record<string, { title: string; text: string; type: 'weight_loss' | 'muscle_gain' | 'maintenance' }> = {
    // Português (esperado originalmente)
    'emagrecimento': {
      title: 'Menu Emagrecimento',
      text: '🔻 Emagrecimento',
      type: 'weight_loss'
    },
    'ganho_massa': {
      title: 'Menu Ganho de Massa',
      text: '🔺 Ganho de Massa',
      type: 'muscle_gain'
    },
    'manutencao': {
      title: 'Menu Manutenção',
      text: '⚖️ Manutenção',
      type: 'maintenance'
    },
    // Compatibilidade com valor antigo
    'ganho_de_peso': {
      title: 'Menu Ganho de Massa',
      text: '🔺 Ganho de Massa',
      type: 'muscle_gain'
    },
    // Inglês (retornado pela API real)
    'weight_loss': {
      title: 'Menu Emagrecimento',
      text: '🔻 Emagrecimento',
      type: 'weight_loss'
    },
    'muscle_gain': {
      title: 'Menu Ganho de Massa',
      text: '🔺 Ganho de Massa',
      type: 'muscle_gain'
    },
    'maintenance': {
      title: 'Menu Manutenção',
      text: '⚖️ Manutenção',
      type: 'maintenance'
    }
  };

  const objectiveInfo = objectiveMap[plan.objective];
  
  // Se não encontrou no mapa, usar padrão
  if (!objectiveInfo) {
    return {
      id: plan.plan_id,
      patient_id: patientId,
      title: 'Menu Personalizado',
      objective: 'Objetivo Personalizado',
      date: new Date(plan.created_at).toLocaleDateString('pt-BR'),
      type: 'maintenance',
      daily_energy_kcal: plan.total_calories,
      created_at: plan.created_at,
      current_weight: plan.current_weight,
      age: plan.age
    };
  }
  
  // Formata a data para exibição
  const date = new Date(plan.created_at);
  const formattedDate = date.toLocaleDateString('pt-BR');

  return {
    id: plan.plan_id,
    patient_id: patientId,
    title: objectiveInfo.title,
    objective: objectiveInfo.text,
    date: formattedDate,
    type: objectiveInfo.type,
    daily_energy_kcal: plan.total_calories,
    created_at: plan.created_at,
    current_weight: plan.current_weight,
    age: plan.age
  };
}

/**
 * Busca o histórico de menus de um paciente pelo CPF
 * 
 * @param cpf - CPF do paciente (apenas números)
 * @returns Promise com lista de menus do paciente
 */
export async function getMenuHistory(cpf: string): Promise<MenuHistoryResponse> {
  if (!API_KEY) {
    return {
      success: false,
      menus: [],
      total: 0,
      error: 'API Key não configurada'
    };
  }
  
  try {
    const response = await fetch(API_LIST_PLANS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        patient_id: cpf
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    let data = await response.json();
    
    // A API retorna o JSON dentro de um campo "body" como string
    // Precisamos parsear novamente
    let apiResponse: MenuHistoryApiResponse;
    
    if (data.body && typeof data.body === 'string') {
      apiResponse = JSON.parse(data.body);
    } else if (data.success !== undefined) {
      // Se já veio parseado corretamente
      apiResponse = data;
    } else {
      throw new Error('Formato de resposta inesperado');
    }
    
    if (!apiResponse.success) {
      return {
        success: false,
        menus: [],
        total: 0,
        error: 'API retornou sucesso = false'
      };
    }
    
    // Converte os planos da API para o formato de exibição
    const menus = apiResponse.plans.map(plan => 
      convertPlanToSummary(plan, cpf)
    );
    
    return {
      success: true,
      menus: menus,
      total: apiResponse.total_plans
    };
  } catch (error) {
    return {
      success: false,
      menus: [],
      total: 0,
      error: 'Erro ao buscar histórico'
    };
  }
}

/**
 * Busca os detalhes completos de um menu específico
 * 
 * @param patientId - CPF do paciente (apenas números)
 * @param planId - ID do plano
 * @returns Promise com os detalhes completos do menu
 */
export async function getMenuDetail(patientId: string, planId: string): Promise<MenuDetailResponse> {
  if (!API_KEY) {
    return {
      success: false,
      error: 'API Key não configurada'
    };
  }
  
  try {
    const response = await fetch(API_GET_PLAN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        patient_id: patientId,
        plan_id: planId
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    let data = await response.json();
    
    // A API pode retornar o JSON dentro de um campo "body" como string
    let parsedData: any;
    
    if (data.body && typeof data.body === 'string') {
      parsedData = JSON.parse(data.body);
    } else {
      parsedData = data;
    }
    
    // Verifica se houve erro
    if (parsedData.success === false) {
      return {
        success: false,
        error: parsedData.error || parsedData.message || 'Erro ao buscar detalhes do menu'
      };
    }
    
    // A API retorna o plano em data.meal_plan
    let plan: MenuPlan;
    
    if (parsedData.data && parsedData.data.meal_plan) {
      plan = parsedData.data.meal_plan;
    } else if (parsedData.plan) {
      plan = parsedData.plan;
    } else if (parsedData.meal_plan) {
      plan = parsedData.meal_plan;
    } else {
      plan = parsedData;
    }
    
    return {
      success: true,
      plan: plan
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao buscar detalhes do menu'
    };
  }
}

/**
 * Exemplo de integração futura:
 * 
 * ```typescript
 * // Buscar histórico
 * const history = await getMenuHistory('12345678900');
 * if (history.success) {
 *   console.log('Menus:', history.menus);
 * }
 * 
 * // Buscar detalhes de um menu
 * const details = await getMenuDetail('plan-001');
 * if (details.success) {
 *   console.log('Plano:', details.plan);
 * }
 * ```
 */

