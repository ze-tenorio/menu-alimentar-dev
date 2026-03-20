/**
 * Serviço de API para avaliações CSAT (Customer Satisfaction)
 * 
 * Este arquivo contém as funções para enviar avaliações de satisfação
 * dos usuários sobre os menus alimentares gerados.
 */

export interface CsatPayload {
  plan_id: string;
  rating: number;
  comment: string;
  patient_id: string;
}

export interface CsatApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * URL da API para CSAT - Produção
 */
const CSAT_API_URL = 'https://e2kqx2zwtc.execute-api.us-east-2.amazonaws.com/dev/plan-csat';

/**
 * API Key para autenticação
 */
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Chave para verificar se já foi avaliado
 */
const CSAT_EVALUATED_KEY = 'csat_evaluated_plans';

/**
 * Envia uma avaliação CSAT para a API
 * 
 * @param planId - ID do plano alimentar
 * @param rating - Nota de 1 a 5 estrelas
 * @param comment - Comentário opcional (string vazia se não houver)
 * @param patientId - CPF do paciente
 * @returns Promise com a resposta da API
 */
export async function submitCsatEvaluation(
  planId: string,
  rating: number,
  comment: string,
  patientId: string
): Promise<CsatApiResponse> {
  // Validar dados obrigatórios
  if (!planId || !patientId) {
    console.error('[CSAT] Dados obrigatórios faltando:', { planId, patientId });
    return {
      success: false,
      error: 'Dados obrigatórios faltando'
    };
  }

  if (!API_KEY) {
    console.error('[CSAT] API Key não configurada');
    return {
      success: false,
      error: 'API Key não configurada'
    };
  }

  const payload: CsatPayload = {
    plan_id: planId,
    rating,
    comment: comment || '', // String vazia se não houver comentário
    patient_id: patientId
  };

  try {
    console.log('[CSAT] Enviando avaliação:', payload);

    const response = await fetch(CSAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CSAT] Erro HTTP:', response.status, errorText);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('[CSAT] Resposta da API:', data);
    
    // Marcar como avaliado após sucesso
    markPlanAsEvaluated(planId);
    
    return {
      success: true,
      message: data.message || 'Avaliação enviada com sucesso'
    };
  } catch (error) {
    console.error('[CSAT] Erro ao enviar avaliação:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar avaliação'
    };
  }
}

/**
 * Marca um plano como já avaliado
 */
function markPlanAsEvaluated(planId: string): void {
  try {
    const stored = sessionStorage.getItem(CSAT_EVALUATED_KEY);
    const evaluatedPlans: string[] = stored ? JSON.parse(stored) : [];
    if (!evaluatedPlans.includes(planId)) {
      evaluatedPlans.push(planId);
      sessionStorage.setItem(CSAT_EVALUATED_KEY, JSON.stringify(evaluatedPlans));
    }
  } catch (error) {
    console.error('[CSAT] Erro ao marcar plano como avaliado:', error);
  }
}

/**
 * Verifica se um plano já foi avaliado
 */
export function isPlanEvaluated(planId: string): boolean {
  try {
    const stored = sessionStorage.getItem(CSAT_EVALUATED_KEY);
    if (!stored) return false;
    
    const evaluatedPlans: string[] = JSON.parse(stored);
    return evaluatedPlans.includes(planId);
  } catch (error) {
    return false;
  }
}
