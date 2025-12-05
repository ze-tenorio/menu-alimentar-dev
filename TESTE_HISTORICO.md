# 🧪 Guia de Teste - Histórico de Menus

## CPFs Mock para Teste

**✨ QUALQUER CPF funciona!** Para facilitar os testes, o mock está configurado para retornar 3 menus de exemplo para qualquer CPF que você digitar.

### Exemplos de Teste:

#### Seu CPF ou qualquer CPF válido (11 dígitos)
**Sempre retorna 3 menus:**

1. **Menu Emagrecimento** (20/11/2025)
   - 📊 Idade: 35 anos
   - ⚖️ Peso atual: 85.5 kg
   - 🔥 Calorias: 1,800 kcal/dia
   - 🎯 Objetivo: Perda de Peso e Definição

2. **Menu Manutenção** (15/11/2025)
   - 📊 Idade: 35 anos
   - ⚖️ Peso atual: 78.0 kg
   - 🔥 Calorias: 2,200 kcal/dia
   - 🎯 Objetivo: Manutenção de Peso e Saúde Geral

3. **Menu Ganho de Massa** (10/11/2025)
   - 📊 Idade: 34 anos
   - ⚖️ Peso atual: 72.0 kg
   - 🔥 Calorias: 2,800 kcal/dia
   - 🎯 Objetivo: Ganho de Peso e Massa Muscular

---

### CPF: 987.654.321-00
**2 menus cadastrados:**

1. **Menu Ganho de Massa** (22/11/2025)
   - Peso atual: 65.0 kg → Peso alvo: 75.0 kg
   - Total de calorias: 3,200 kcal/dia
   - Objetivo: Ganho de Peso e Massa Muscular

2. **Menu Emagrecimento** (18/11/2025)
   - Peso atual: 90.0 kg → Peso alvo: 80.0 kg
   - Total de calorias: 1,600 kcal/dia
   - Objetivo: Perda de Peso e Definição

---

### CPFs com Dados Específicos (opcional)

Se quiser testar com dados específicos, use:

#### CPF: 123.456.789-00
**3 menus personalizados**

#### CPF: 987.654.321-00
**2 menus personalizados**

---

## 📋 Como Testar

1. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acessar a aplicação:**
   - Abra http://localhost:8080

3. **Fluxo de teste:**
   - Na tela inicial, clique em **"Ver Meus Menus"**
   - Digite um dos CPFs de teste acima
   - Clique em **"Continuar"**
   - Aguarde o carregamento (simula 1 segundo de delay da API)
   - Visualize a lista de menus históricos

4. **Testar criação de novo menu:**
   - Na tela de lista, clique em **"Criar Novo Menu"**
   - O formulário irá usar o CPF já digitado (não pedirá novamente)
   - Preencha o formulário normalmente
   - ⚠️ **ATENÇÃO:** Ao tentar gerar o menu, você verá o erro de CORS
     - Isso é esperado! O erro será resolvido no backend
     - O mock do histórico está funcionando corretamente

5. **Testar visualização de menu histórico:**
   - Clique em um dos cards de menu
   - Atualmente mostra um alert informando que será implementado
   - Quando a API de detalhes estiver pronta, isso será integrado

---

## 🔧 Formato da Resposta da API (Implementado)

```json
{
  "success": true,
  "patient_id": "12345678900",
  "total_plans": 2,
  "plans": [
    {
      "plan_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2025-11-24T10:30:00.000000",
      "objective": "emagrecimento",
      "current_weight": 85.5,
      "total_calories": 1800.0,
      "age": 35
    },
    {
      "plan_id": "650e8400-e29b-41d4-a716-446655440001",
      "created_at": "2025-11-20T14:20:00.000000",
      "objective": "manutencao",
      "current_weight": 85.5,
      "total_calories": 2200.0,
      "age": 35
    }
  ],
  "execution_id": "abc123-def456",
  "timestamp": "2025-11-24T15:45:30.123456"
}
```

### Campos da Resposta:
- `success`: indica se a requisição foi bem-sucedida
- `patient_id`: CPF do paciente (sem formatação)
- `total_plans`: número total de planos
- `plans`: array de planos
- `execution_id`: ID da execução (opcional)
- `timestamp`: timestamp da resposta (opcional)

### Campos de Cada Plano:
- `plan_id`: UUID do plano (guardado para buscar detalhes)
- `created_at`: data/hora de criação (ISO 8601)
- `objective`: `emagrecimento`, `ganho_de_peso` ou `manutencao`
- `current_weight`: peso atual do paciente em kg
- `total_calories`: total de calorias diárias do plano
- `age`: idade do paciente em anos

**Nota:** O `plan_id` NÃO é exibido no card, mas é guardado para fazer a requisição de detalhes quando o usuário clicar no menu.

---

## ✅ O Que Está Funcionando (Mock)

- ✅ Entrada de CPF com formatação automática
- ✅ Validação de CPF (11 dígitos)
- ✅ Busca de histórico (mock com dados de exemplo)
- ✅ Exibição de lista de menus com:
  - Título baseado no objetivo
  - Data formatada (DD/MM/AAAA)
  - Ícone grande por tipo de objetivo (📉 💪 ⚖️)
  - **Idade** (anos) com ícone 👤
  - **Peso atual** (kg) com ícone ⚖️
  - **Calorias diárias** formatadas com ícone 🔥
- ✅ Estado vazio quando não há menus
- ✅ Botão "Criar Novo Menu" que reaproveita o CPF
- ✅ Loading screen personalizada ("Carregando seus menus..." com ícone 📋)
- ✅ Layout melhorado com grid de 3 colunas para as informações

---

## 🔮 Próximos Passos (Integração Real)

Quando a API estiver pronta:

1. **Configurar variáveis de ambiente:**
   - Adicionar endpoint da API de histórico
   - Configurar API key

2. **Substituir mock em `menuHistoryApi.ts`:**
   - Descomentar a chamada real no `getMenuHistory()`
   - Remover `MOCK_API_RESPONSES`

3. **Implementar `getMenuDetail()`:**
   - Buscar detalhes completos de um menu específico
   - Exibir na `GeneratedMenuScreen`

4. **Testar integração completa:**
   - Buscar histórico real
   - Visualizar menus antigos
   - Criar novos menus

---

## 🐛 Problemas Conhecidos

- ⚠️ **CORS Error ao gerar menu:** Será resolvido no backend
- ⚠️ **Visualização de menus históricos:** Exibe alert (aguardando API de detalhes)
- ✅ **API Key configurada:** Verificação implementada com logs

---

## 📝 Notas Técnicas

- **Delay simulado:** 1 segundo (configurável)
- **Formato de data:** Automático para pt-BR
- **Conversão de objetivo:** Mapeamento automático para títulos e tipos
- **Ordenação:** Menus mais recentes primeiro (pela API)

