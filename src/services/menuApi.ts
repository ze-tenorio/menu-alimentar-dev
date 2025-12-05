/**
 * Serviço de API para geração de menus alimentares
 * 
 * Este arquivo contém as funções para se comunicar com a API de IA
 * que gera os planos alimentares personalizados.
 */

export interface MenuApiPayload {
  request_metadata: {
    patient_id: string;
    doctor_id: string;
    appointment_id: string;
    region: string;
    request_type: string;
  };
  patient_profile: {
    full_name: string;
    gender: string;
    age: number;
    current_weight_kg: number;
    height_m: number;
  };
  nutritional_plan_goals: {
    primary_objective: string;
  };
  medical_and_supplements: {
    pathologies: string[];
  };
  dietary_restrictions_and_habits: {
    diet_type: string;
    allergies: string[];
    intolerances: string[];
    aversions: string[];
    preferences: string[];
  };
  routine_and_activity: {
    physical_activity: {
      practices: boolean;
      frequency: string;
      intensity: string;
    };
  };
}

export interface MealItem {
  name: string;
  description: string;
  portion: string;
  alternatives: string[];
  notes: string;
  is_optional: boolean;
}

export interface Meal {
  name: string;
  type: string;
  target_kcal: number;
  items: MealItem[];
}

export interface MenuPlan {
  plan_id: string;
  user_id?: string;
  patient_id?: string;
  daily_energy_kcal: number;
  macros: {
    calories_kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  meals: Meal[] | {
    breakfast?: Meal;
    morning_snack?: Meal;
    lunch?: Meal;
    afternoon_snack?: Meal;
    dinner?: Meal;
    supper?: Meal;
    [key: string]: Meal | undefined;
  };
  nutritional_guidelines_detailed?: {
    date: string;
    patient_name: string;
    fluids: string;
    objective: string;
    supplements: string;
    next_appointment: string;
  };
  scientific_metadata?: {
    bmi_current: number;
    bmi_target: number;
    geb_kcal: number;
    naf_factor: number;
  };
  [key: string]: any;
}

export interface MenuApiResponse {
  success: boolean;
  plan?: MenuPlan;
  metadata?: {
    processing_time: number;
    methodology: string;
    version: string;
    [key: string]: any;
  };
  message?: string;
  error?: string;
}

/**
 * URL da API - Produção
 */
const API_URL = 'https://kpg71puaqk.execute-api.us-east-2.amazonaws.com/prd/meal-plan-agent';

/**
 * API Key para autenticação
 * Deve ser configurada na variável de ambiente VITE_API_KEY
 */
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Gera um menu alimentar personalizado através da API de IA
 * 
 * @param payload - Dados do paciente e preferências alimentares
 * @returns Promise com a resposta da API contendo o menu gerado
 * 
 * NOTA: Esta requisição pode levar de 20 a 30 segundos para retornar
 * 
 * @example
 * ```typescript
 * const payload = {
 *   request_metadata: { ... },
 *   patient_profile: { ... },
 *   // ... outros campos
 * };
 * 
 * try {
 *   const result = await generateMenu(payload);
 *   if (result.success) {
 *     console.log('Menu gerado:', result.plan);
 *   } else {
 *     console.error('Erro:', result.error);
 *   }
 * } catch (error) {
 *   console.error('Erro ao gerar menu:', error);
 * }
 * ```
 */
export async function generateMenu(payload: MenuApiPayload): Promise<MenuApiResponse> {
  if (!API_KEY) {
    return {
      success: false,
      error: 'API Key não configurada. Verifique o arquivo .env.local com VITE_API_KEY'
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data: MenuApiResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Erro ao gerar menu',
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao gerar menu. Por favor, tente novamente.',
    };
  }
}

/**
 * Exemplo de uso no componente:
 * 
 * ```typescript
 * import { generateMenu } from './services/menuApi';
 * 
 * const handleMenuFormComplete = async (payload: any) => {
 *   console.log('Payload recebido no App:', payload);
 *   setFormData(payload);
 *   setShowMenuForm(false);
 *   setShowMenuLoading(true);
 *   
 *   try {
 *     const result = await generateMenu(payload);
 *     if (result.success) {
 *       // Menu gerado com sucesso
 *       console.log('Menu gerado:', result.menu);
 *       // Continuar com o fluxo...
 *     } else {
 *       // Tratar erro
 *       console.error('Erro:', result.message);
 *       alert('Erro ao gerar menu: ' + result.message);
 *     }
 *   } catch (error) {
 *     console.error('Erro ao gerar menu:', error);
 *     alert('Erro ao gerar menu');
 *   }
 * };
 * ```
 */

