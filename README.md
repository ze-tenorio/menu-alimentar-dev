# Menu Alimentar - TotalPass

Projeto isolado com a funcionalidade de Menu Alimentar do TotalPass.

## Funcionalidades

- Tela inicial de Menu Alimentar
- Formulário de 8 etapas para coleta de dados
- Tela de carregamento com dicas
- Visualização do menu gerado
- Lista de menus criados
- Lista de compras

## Como executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

3. Para build de produção:
```bash
npm run build
```

## Estrutura do Projeto

```
src/
  components/
    MenuAlimentarScreen.tsx      # Tela inicial
    MenuAlimentarForm.tsx        # Formulário de 8 etapas
    MenuLoadingScreen.tsx        # Tela de carregamento
    GeneratedMenuScreen.tsx     # Menu gerado
    MenusListScreen.tsx         # Lista de menus
    ShoppingListScreen.tsx      # Lista de compras
    TransitionScreen.tsx        # Tela de transição
  lib/
    utils.ts                    # Utilitários
  App.tsx                       # Componente principal
  main.tsx                      # Entry point
  index.css                     # Estilos globais
```

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)

