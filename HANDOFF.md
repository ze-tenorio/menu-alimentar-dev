# 📋 Documentação de Handoff - Menu Alimentar por IA

## 📖 Visão Geral

O **Menu Alimentar** é uma aplicação web frontend desenvolvida para a **TotalPass** (powered by **Starbem**) que permite aos usuários criar planos alimentares personalizados utilizando inteligência artificial.

### Objetivo do Produto
Oferecer aos usuários uma ferramenta para gerar menus alimentares personalizados baseados em:
- Dados pessoais (idade, peso, altura, sexo)
- Objetivo nutricional (emagrecimento, manutenção, ganho de massa)
- Nível de atividade física
- Restrições alimentares (alergias, intolerâncias, aversões)
- Preferências pessoais

---

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Framework UI |
| **TypeScript** | 5.8.3 | Tipagem estática |
| **Vite** | 5.4.x | Build tool e dev server |
| **Tailwind CSS** | 3.4.x | Estilização |
| **Lucide React** | 0.462.0 | Ícones |
| **clsx + tailwind-merge** | - | Utilitários de classes CSS |

---

## 📁 Estrutura do Projeto

```
food-menu/
├── public/                      # Assets estáticos
│   ├── favicon.png
│   ├── logo-starbem.png
│   ├── logo-totalpass-new.png
│   └── logo TP.png
├── src/
│   ├── components/              # Componentes React
│   │   ├── CpfEntryScreen.tsx       # Tela de entrada de CPF
│   │   ├── CsatModal.tsx            # Modal de avaliação CSAT
│   │   ├── GeneratedMenuScreen.tsx  # Visualização do menu gerado
│   │   ├── MenuAlimentarForm.tsx    # Formulário de 12 etapas
│   │   ├── MenuAlimentarScreen.tsx  # Tela inicial/home
│   │   ├── MenuLoadingScreen.tsx    # Tela de carregamento
│   │   ├── MenusListScreen.tsx      # Lista de menus do usuário
│   │   └── TransitionScreen.tsx     # Tela de transição inicial
│   ├── services/                # Serviços de API
│   │   ├── csatApi.ts               # API de avaliação CSAT
│   │   ├── menuApi.ts               # API de geração de menu
│   │   └── menuHistoryApi.ts        # API de histórico de menus
│   ├── lib/
│   │   └── utils.ts             # Utilitários (cn function)
│   ├── App.tsx                  # Componente principal + roteamento
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais + variáveis CSS
├── .env.local                   # Variáveis de ambiente (não commitado)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔄 Fluxo da Aplicação

```
┌─────────────────────┐
│  TransitionScreen   │  → Tela de splash inicial
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ MenuAlimentarScreen │  → Home com opções: "Ver Menus" ou "Criar Novo"
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌───────────┐ ┌─────────────────┐
│ CpfEntry  │ │ MenuAlimentar   │
│  Screen   │ │     Form        │ → Formulário de 12 etapas
└─────┬─────┘ └────────┬────────┘
      │                │
      ▼                ▼
┌───────────┐ ┌─────────────────┐
│ MenusList │ │ MenuLoading     │ → Aguarda API (20-30s)
│  Screen   │ │    Screen       │
└─────┬─────┘ └────────┬────────┘
      │                │
      └───────┬────────┘
              ▼
    ┌─────────────────────┐
    │ GeneratedMenuScreen │ → Exibe menu + Modal CSAT (após 8s)
    └─────────────────────┘
```

---

## 🧩 Componentes Principais

### 1. `App.tsx`
Gerencia todo o estado da aplicação e controla a navegação entre telas.

**Estados principais:**
- `showTransition`, `showMenuAlimentar`, `showCpfEntry`, etc. → Controle de telas
- `userCpf` → CPF do usuário (persiste no sessionStorage)
- `currentMenu` → Menu atual sendo visualizado
- `historicalMenus` → Histórico de menus do usuário
- `isMenuNewlyGenerated` → Flag para exibir CSAT apenas em menus recém-criados

### 2. `MenuAlimentarForm.tsx`
Formulário de 12 etapas para coleta de dados:

| Step | Dados Coletados |
|------|-----------------|
| 1 | CPF |
| 2 | Nome + Sexo biológico |
| 3 | Idade + Peso + Altura |
| 4 | Patologias/doenças |
| 5 | Objetivo (emagrecimento/manutenção/ganho) |
| 6 | Frequência de atividade física |
| 7 | Intensidade do exercício |
| 8 | Tipo de dieta |
| 9 | Alergias alimentares |
| 10 | Intolerâncias alimentares |
| 11 | Aversões alimentares |
| 12 | Preferências alimentares |

### 3. `GeneratedMenuScreen.tsx`
Exibe o menu gerado com:
- Informações nutricionais (calorias, macros)
- Refeições ordenadas (café da manhã → ceia)
- Opções e substituições para cada refeição
- Banner promocional (TP3 + nutricionista)
- Modal CSAT após 8 segundos (apenas para menus novos)

### 4. `CsatModal.tsx`
Modal de avaliação de satisfação:
- Avaliação por 5 estrelas
- Campo opcional para comentários
- Feedback visual com emojis
- Envia dados para API de CSAT

---

## 🔌 APIs e Endpoints

### Base URL
```
https://kpg71puaqk.execute-api.us-east-2.amazonaws.com/prd
```

### Autenticação
Todas as requisições requerem header:
```
x-api-key: {VITE_API_KEY}
```

### Endpoints

#### 1. Geração de Menu
```
POST /meal-plan-agent
```
**Payload:**
```json
{
  "request_metadata": {
    "patient_id": "12345678900",
    "request_type": "plan_builder"
  },
  "patient_profile": {
    "full_name": "Nome Completo",
    "gender": "M",
    "age": 30,
    "current_weight_kg": 75.5,
    "height_m": 1.75
  },
  "nutritional_plan_goals": {
    "primary_objective": "emagrecimento"
  },
  "medical_and_supplements": {
    "pathologies": ["diabetes"]
  },
  "dietary_restrictions_and_habits": {
    "diet_type": "onivora",
    "allergies": ["amendoim"],
    "intolerances": ["lactose"],
    "aversions": ["berinjela"],
    "preferences": ["frango", "arroz"]
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
**Tempo de resposta:** 20-30 segundos

#### 2. Lista de Planos
```
POST /list-plans
```
**Payload:**
```json
{
  "patient_id": "12345678900"
}
```

#### 3. Detalhes do Plano
```
POST /get-plan
```
**Payload:**
```json
{
  "patient_id": "12345678900",
  "plan_id": "uuid-do-plano"
}
```

#### 4. Avaliação CSAT
```
POST /plan-csat
```
**Payload:**
```json
{
  "plan_id": "uuid-do-plano",
  "rating": 5,
  "comment": "Comentário opcional",
  "patient_id": "12345678900"
}
```

---

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente (.env.local)
```bash
# API Key para autenticação nos endpoints
VITE_API_KEY=sua-api-key-aqui
```

### Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (porta 8080)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 🎨 Sistema de Design

### Cores Principais (CSS Variables)
```css
--primary: 151 65% 50%;        /* Verde Starbem */
--primary-foreground: 0 0% 100%;
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
```

### Tipografia
- Fonte principal: **Poppins** (Google Fonts)
- Fallback: sans-serif

### Border Radius
- Padrão: `12px` (`--radius`)

---

## 📱 Responsividade

A aplicação foi desenvolvida com foco em **mobile-first**, sendo otimizada para:
- Dispositivos móveis (smartphones)
- Tablets
- Desktop (funcional, mas UX otimizada para mobile)

---

## 🔒 Armazenamento de Dados

### sessionStorage
- `userCpf` → CPF do usuário (limpo ao fechar aba)
- `csat_evaluated_plans` → IDs de planos já avaliados

### localStorage
- `csat_evaluations` → Backup local de avaliações CSAT (fallback)

---

## 🚀 Deploy

### Build
```bash
npm run build
```
Gera pasta `dist/` com arquivos estáticos.

### Hospedagem Recomendada
- AWS S3 + CloudFront
- Vercel
- Netlify
- Firebase Hosting

### Variáveis de Ambiente em Produção
Configurar `VITE_API_KEY` no ambiente de build.

---

## 🐛 Pontos de Atenção

### 1. Tempo de Resposta da API
A geração de menu leva 20-30 segundos. A tela de loading não tem timeout - aguarda indefinidamente a resposta.

### 2. Validação de CPF
O sistema valida apenas o formato (11 dígitos), não faz validação matemática do CPF.

### 3. CSAT Modal
- Só aparece para menus **recém-gerados** (não para visualização de histórico)
- Delay de **8 segundos** antes de exibir
- Cada plano só pode ser avaliado uma vez por sessão

### 4. Ordenação de Refeições
As refeições são ordenadas automaticamente baseadas no nome/tipo:
1. Café da manhã
2. Lanche da manhã
3. Almoço
4. Lanche da tarde
5. Jantar
6. Ceia

---

## 📞 Contatos e Recursos

### Repositório
[Inserir URL do repositório]

### Documentação da API
[Inserir link para Swagger/OpenAPI se disponível]

### Design/Figma
[Inserir link do Figma se disponível]

---

## 📝 Histórico de Versões

| Data | Versão | Alterações |
|------|--------|------------|
| Jan/2026 | 1.0.0 | Implementação inicial |
| Jan/2026 | 1.1.0 | Adição do módulo CSAT |

---

## ✅ Checklist de Handoff

- [x] Código fonte completo e funcional
- [x] Documentação de APIs
- [x] Variáveis de ambiente documentadas
- [x] Fluxo da aplicação mapeado
- [x] Componentes documentados
- [ ] Testes automatizados (não implementados)
- [ ] CI/CD configurado (verificar com equipe de DevOps)
- [ ] Monitoramento/Analytics (verificar integração)

---

*Documentação gerada em Janeiro de 2026*

