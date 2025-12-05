# Guia de Teste - Integração com API de Menu Alimentar

## ✅ Integração Completa Implementada

A integração com a API está **100% funcional** e pronta para uso!

### Endpoint Configurado:
```
POST https://e2kqx2zwtc.execute-api.us-east-2.amazonaws.com/dev/meal-plan-agent
```

## 🚀 Como Testar

### 1. Iniciar o Projeto

```bash
cd /Users/jlptenorio/Documents/starbem/menu-alimentar
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

### 2. Fluxo de Teste Completo

1. **Tela Inicial** → Clique em "Criar Menu Alimentar"

2. **Passo 1 - CPF**
   - Digite um CPF válido (ex: 123.456.789-00)
   - O sistema formata automaticamente

3. **Passo 2 - Dados Pessoais**
   - Nome completo
   - Selecione sexo biológico (M ou F)

4. **Passo 3 - Dados de Saúde**
   - Idade: ex: 28
   - Peso: ex: 75 (em kg)
   - Altura: ex: 175 (em cm)

5. **Passo 4 - Doenças**
   - Selecione se possui doenças
   - Se sim, liste as doenças separadas por vírgula

6. **Passo 5 - Objetivo**
   - Emagrecimento
   - Ganho de peso
   - Manutenção

7. **Passo 6 - Frequência de Atividade Física**
   - Sedentário até Muito ativo

8. **Passo 7 - Intensidade**
   - Leve, Moderada ou Intensa

9. **Passo 8 - Tipo de Dieta**
   - Onívora, Vegetariana, Vegana, etc.

10. **Passo 9 - Alergias**
    - Selecione todas as alergias que possui

11. **Passo 10 - Intolerâncias**
    - Selecione todas as intolerâncias

12. **Passo 11 - Aversões**
    - Digite alimentos que não gosta (separados por vírgula)

13. **Passo 12 - Preferências**
    - Digite alimentos que gosta (separados por vírgula)
    - Clique em "Continuar"

### 3. Processamento (20-30 segundos)

Após completar o formulário:
- Uma tela de loading será exibida
- A requisição será enviada para a API
- **Aguarde 20-30 segundos** (tempo normal de processamento da IA)
- O console do navegador mostrará logs detalhados

### 4. Visualização do Menu

Quando a API retornar:
- O menu gerado será exibido automaticamente
- Você verá:
  - Informações nutricionais (calorias, macros)
  - Recomendações de hidratação e suplementos
  - Todas as refeições do dia com opções
  - Alternativas para cada alimento

## 🔍 Monitorando a Integração

### Console do Navegador (F12)

Abra o console e você verá logs detalhados:

```javascript
// Quando o formulário for completado:
Payload recebido no App: {...}
Enviando requisição para API: https://...
Payload: {...}

// Durante o processamento:
Status da resposta: 200

// Quando a resposta chegar:
Resposta da API: {...}
Menu gerado com sucesso: {...}
```

### Network Tab

Na aba Network do DevTools:
1. Filtre por "XHR" ou "Fetch"
2. Você verá a requisição para `/meal-plan-agent`
3. Clique para ver:
   - **Request Payload**: dados enviados
   - **Response**: menu retornado pela API
   - **Time**: tempo de processamento (20-30s)

## 📊 Exemplo de Payload Enviado

```json
{
  "request_metadata": {
    "patient_id": "12345678900",
    "doctor_id": "web-app-uuid",
    "appointment_id": "web-1731532800000",
    "region": "brasil",
    "request_type": "plan_builder"
  },
  "patient_profile": {
    "full_name": "João Silva",
    "gender": "M",
    "age": 28,
    "current_weight_kg": 75,
    "height_m": 1.75
  },
  "nutritional_plan_goals": {
    "primary_objective": "emagrecimento"
  },
  "medical_and_supplements": {
    "pathologies": []
  },
  "dietary_restrictions_and_habits": {
    "diet_type": "onivora",
    "allergies": ["Glúten"],
    "intolerances": ["Lactose"],
    "aversions": ["Brócolis"],
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

## 📋 Exemplo de Resposta da API

```json
{
  "success": true,
  "plan": {
    "plan_id": "sci_plan_xxx",
    "daily_energy_kcal": 3500,
    "macros": {
      "calories_kcal": 3500,
      "protein_g": 218.75,
      "carbs_g": 393.75,
      "fat_g": 116.67
    },
    "meals": [
      {
        "name": "Café da Manhã",
        "type": "cafe_manha",
        "target_kcal": 827,
        "items": [
          {
            "name": "GRUPO 1",
            "description": "OPÇÃO 1: Ovos mexidos...",
            "portion": "150g OU 50g...",
            "alternatives": ["..."],
            "notes": "",
            "is_optional": false
          }
        ]
      }
    ]
  },
  "metadata": {
    "processing_time": 16.06,
    "version": "3.0"
  }
}
```

## ⚠️ Tratamento de Erros

Se algo der errado:
- Um alerta será exibido ao usuário
- O formulário voltará para permitir correções
- Erros serão logados no console

### Possíveis Erros:

1. **Erro de Rede**
   - Verifique sua conexão com a internet
   - Verifique se a API está online

2. **Timeout**
   - A API pode levar até 30 segundos
   - Se passar disso, pode haver problema no servidor

3. **Dados Inválidos**
   - Verifique se todos os campos obrigatórios foram preenchidos
   - Verifique o formato dos dados

## 🎯 Checklist de Teste

- [ ] Formulário completa todos os 12 passos
- [ ] CPF é formatado automaticamente
- [ ] Campos numéricos aceitam valores válidos
- [ ] Seleções múltiplas funcionam (alergias, intolerâncias)
- [ ] Tela de loading aparece após enviar
- [ ] Console mostra "Enviando requisição para API"
- [ ] Aguardar 20-30 segundos
- [ ] Console mostra "Menu gerado com sucesso"
- [ ] Tela de menu é exibida com dados da API
- [ ] Informações nutricionais são mostradas
- [ ] Todas as refeições são listadas
- [ ] Alternativas de alimentos são exibidas

## 📱 Testando Múltiplos Menus

1. Complete um formulário e aguarde o menu ser gerado
2. Volte para a tela inicial
3. Clique em "Meus Menus (1)"
4. Você verá a lista de menus criados
5. Clique em um menu para visualizá-lo novamente

## 🐛 Debug Avançado

### Inspecionar Requisição Completa

```javascript
// No console do navegador:
// A requisição é feita automaticamente pelo código
// Mas você pode testar manualmente:

const payload = {
  request_metadata: {
    patient_id: "12345678900",
    doctor_id: "web-app-uuid",
    appointment_id: "web-" + Date.now(),
    region: "brasil",
    request_type: "plan_builder"
  },
  // ... resto do payload
};

fetch('https://e2kqx2zwtc.execute-api.us-east-2.amazonaws.com/dev/meal-plan-agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(console.log);
```

## ✨ Funcionalidades Implementadas

- ✅ Formulário de 12 passos completo
- ✅ Validação e formatação de campos
- ✅ Envio de payload para API
- ✅ Tratamento de loading (20-30s)
- ✅ Tratamento de erros
- ✅ Exibição de menu gerado
- ✅ Informações nutricionais detalhadas
- ✅ Alternativas de alimentos
- ✅ Histórico de menus criados
- ✅ Visualização de menus salvos

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Verifique a aba Network
3. Verifique se a API está respondendo
4. Verifique o formato do payload enviado

## 🎉 Próximos Passos

Com a integração completa, você pode:
- [ ] Adicionar autenticação de usuários
- [ ] Salvar menus no localStorage ou banco de dados
- [ ] Implementar exportação de PDF do menu
- [ ] Adicionar compartilhamento de menus
- [ ] Implementar edição de menus salvos
- [ ] Adicionar estatísticas de uso

---

**Status da Integração:** ✅ Completa e Funcional
**Última Atualização:** 13/11/2024

