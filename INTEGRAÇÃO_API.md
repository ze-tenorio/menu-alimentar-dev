# Integração com API de Geração de Menu Alimentar

Este documento descreve as mudanças implementadas para integrar o formulário de menu alimentar com a API de IA.

## Mudanças Implementadas

### 1. Formulário Atualizado (MenuAlimentarForm.tsx)

O formulário foi expandido de 8 para **12 passos** para coletar todos os dados necessários:

#### Passos do Formulário:

1. **CPF** - Identificação do paciente (usado como patient_id)
2. **Dados Pessoais** - Nome completo e sexo biológico
3. **Dados de Saúde** - Idade, peso e altura
4. **Doenças/Patologias** - Condições de saúde do paciente
5. **Objetivo** - Emagrecimento, ganho de peso ou manutenção
6. **Frequência de Atividade Física** - Sedentário, leve, moderado, ativo ou muito ativo
7. **Intensidade do Exercício** - Leve, moderada ou intensa
8. **Tipo de Dieta** - Onívora, vegetariana, vegana, etc.
9. **Alergias Alimentares** - Seleção múltipla de alergias
10. **Intolerâncias Alimentares** - Seleção múltipla de intolerâncias
11. **Aversões Alimentares** - Alimentos que o usuário não gosta
12. **Preferências Alimentares** - Alimentos que o usuário prefere

### 2. Campos Obrigatórios Coletados

Todos os campos obrigatórios especificados são coletados:

- ✅ patient_id (CPF)
- ✅ full_name
- ✅ gender
- ✅ age
- ✅ current_weight_kg
- ✅ height_m
- ✅ primary_objective
- ✅ pathologies
- ✅ diet_type
- ✅ allergies
- ✅ intolerances
- ✅ aversions
- ✅ preferences
- ✅ physical_activity

### 3. Formato do Payload

O formulário agora gera um payload no formato correto para a API:

```json
{
  "request_metadata": {
    "patient_id": "12345678900",
    "doctor_id": "web-app-uuid",
    "appointment_id": "web-1234567890",
    "region": "brasil",
    "request_type": "plan_builder"
  },
  "patient_profile": {
    "full_name": "Nome Completo",
    "gender": "M",
    "age": 28,
    "current_weight_kg": 75,
    "height_m": 1.75
  },
  "nutritional_plan_goals": {
    "primary_objective": "emagrecimento"
  },
  "medical_and_supplements": {
    "pathologies": ["Diabetes", "Hipertensão"]
  },
  "dietary_restrictions_and_habits": {
    "diet_type": "onivora",
    "allergies": ["Glúten", "Leite"],
    "intolerances": ["Lactose"],
    "aversions": ["Brócolis", "Couve"],
    "preferences": ["Frango", "Arroz integral"]
  },
  "routine_and_activity": {
    "physical_activity": {
      "practices": true,
      "frequency": "moderado",
      "intensity": "moderada"
    }
  }
}
```

### 4. Valores dos Campos

#### Objetivo (primary_objective):
- `emagrecimento` - Para perda de peso
- `ganho_de_peso` - Para ganho de peso/massa muscular
- `manutencao` - Para manutenção do peso

#### Sexo Biológico (gender):
- `M` - Masculino
- `F` - Feminino

#### Tipo de Dieta (diet_type):
- `onivora` - Onívora
- `vegetariana` - Vegetariana
- `vegana` - Vegana
- `pescetariana` - Pescetariana
- `low_carb` - Low Carb
- `cetogenica` - Cetogênica

#### Frequência de Atividade Física (frequency):
- `sedentario` - Não pratica atividade física
- `leve` - 1-2 vezes por semana
- `moderado` - 3-4 vezes por semana
- `ativo` - 5-6 vezes por semana
- `muito_ativo` - Diariamente

#### Intensidade do Exercício (intensity):
- `leve` - Caminhada lenta, alongamentos
- `moderada` - Caminhada rápida, natação leve
- `intensa` - Corrida, HIIT, musculação
- `nao_se_aplica` - Não se aplica

## Como Integrar com a API

### Opção 1: Usar o Serviço de API (Recomendado)

Um arquivo de serviço foi criado em `src/services/menuApi.ts` para facilitar a integração.

1. Configure a URL da API no arquivo `.env`:

```bash
VITE_API_URL=https://sua-api.com/api
```

2. Importe e use o serviço no `App.tsx`:

```typescript
import { generateMenu } from './services/menuApi';

const handleMenuFormComplete = async (payload: any) => {
  console.log('Payload recebido no App:', payload);
  setFormData(payload);
  setShowMenuForm(false);
  setShowMenuLoading(true);
  
  try {
    const result = await generateMenu(payload);
    if (result.success) {
      // Menu gerado com sucesso
      console.log('Menu gerado:', result.menu);
      // Processar o menu e continuar o fluxo
    } else {
      // Tratar erro
      console.error('Erro:', result.message);
      alert('Erro ao gerar menu: ' + result.message);
      setShowMenuLoading(false);
      setShowMenuForm(true);
    }
  } catch (error) {
    console.error('Erro ao gerar menu:', error);
    alert('Erro ao gerar menu');
    setShowMenuLoading(false);
    setShowMenuForm(true);
  }
};
```

### Opção 2: Implementação Manual

Se preferir implementar manualmente, há um comentário no código do `App.tsx` (linha 53-63) mostrando onde fazer a chamada:

```typescript
// fetch('URL_DA_API', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(payload)
// })
// .then(response => response.json())
// .then(data => {
//   // Processar resposta da API
// });
```

## Testando o Formulário

1. Execute o projeto:
```bash
npm run dev
```

2. Navegue até a tela de criação de menu

3. Preencha todos os 12 passos do formulário

4. No console do navegador, você verá o payload gerado:
```
Payload gerado: { request_metadata: {...}, patient_profile: {...}, ... }
```

## Próximos Passos

1. **Configurar URL da API**: Adicione a URL real da API no arquivo `.env`

2. **Implementar Autenticação**: Se a API requer autenticação, adicione o token no header da requisição em `src/services/menuApi.ts`

3. **Processar Resposta da API**: Adapte o código para processar a resposta real da API e exibir o menu gerado

4. **Tratamento de Erros**: Implemente um tratamento de erros mais robusto para diferentes cenários

5. **Loading State**: O componente `MenuLoadingScreen` já está implementado e será exibido durante a chamada da API

## Observações Importantes

- O CPF é formatado automaticamente enquanto o usuário digita (formato: 000.000.000-00)
- A altura é coletada em centímetros mas convertida para metros no payload
- Arrays vazios são enviados para alergias, intolerâncias, aversões e preferências quando não informados
- O payload já está no formato correto especificado, enviando apenas os campos obrigatórios

## Estrutura de Arquivos Modificados

```
src/
├── components/
│   └── MenuAlimentarForm.tsx (atualizado - 12 passos)
├── services/
│   └── menuApi.ts (novo - serviço de API)
├── App.tsx (atualizado - fluxo de dados)
└── .env.example (novo - exemplo de configuração)
```

## Suporte

Para dúvidas ou problemas na integração, consulte os comentários no código ou entre em contato com a equipe de desenvolvimento.

