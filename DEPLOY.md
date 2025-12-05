# 🚀 Guia de Deploy - Menu Alimentar

## ✅ Status Atual
- ✅ Git inicializado
- ✅ Commit inicial criado
- ✅ Branch renomeada para `main`

## 📦 Próximos Passos

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Configure:
   - **Nome:** `menu-alimentar`
   - **Descrição:** "Sistema de geração de menus alimentares personalizados com IA"
   - **Visibilidade:** Public ou Private
   - ⚠️ **NÃO marque nenhuma opção** (README, .gitignore, license)
3. Clique em **"Create repository"**

### 2. Conectar e Enviar ao GitHub

Após criar o repositório, copie a URL que aparecerá (algo como: `https://github.com/SEU_USUARIO/menu-alimentar.git`)

Execute no terminal:

```bash
cd /Users/jlptenorio/Documents/starbem/menu-alimentar

# Adicionar remote (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/menu-alimentar.git

# Enviar código para o GitHub
git push -u origin main
```

### 3. Deploy no Vercel

#### Opção A: Deploy via Interface (Recomendado)

1. Acesse: https://vercel.com/login
2. Faça login (pode usar sua conta do GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Clique em **"Import Git Repository"**
5. Selecione o repositório `menu-alimentar`
6. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (já preenchido automaticamente)
   - **Output Directory:** `dist` (já preenchido automaticamente)
   - **Install Command:** `npm install` (já preenchido automaticamente)
7. **Não adicione variáveis de ambiente** (a API já está configurada no código)
8. Clique em **"Deploy"**

#### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# Fazer login
vercel login

# Deploy
cd /Users/jlptenorio/Documents/starbem/menu-alimentar
vercel

# Seguir as instruções:
# - Set up and deploy? Y
# - Which scope? (escolha seu usuário)
# - Link to existing project? N
# - What's your project's name? menu-alimentar
# - In which directory is your code located? ./
# - Want to override the settings? N

# Para produção
vercel --prod
```

### 4. Após o Deploy

Você receberá uma URL como: `https://menu-alimentar-xxx.vercel.app`

#### Testar:
1. Acesse a URL
2. Clique em "Criar Menu Alimentar"
3. Preencha todos os 12 passos
4. Aguarde 20-30 segundos
5. Veja seu menu personalizado!

## 🔧 Configurações do Vercel

O projeto já está configurado corretamente:
- ✅ `vite.config.ts` configurado
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Node.js version: 18+ (Vercel usa automaticamente)

## 🌐 Domínio Customizado (Opcional)

No Vercel, você pode adicionar um domínio customizado:
1. Vá em **Settings** do projeto
2. Clique em **Domains**
3. Adicione seu domínio
4. Configure o DNS conforme as instruções

## 📊 Monitoramento

No dashboard do Vercel você pode ver:
- Analytics de acesso
- Logs de erros
- Performance
- Deploy history

## 🔄 Atualizações Futuras

Para atualizar o site após fazer mudanças:

```bash
# Fazer suas alterações no código
# Depois:
git add .
git commit -m "Descrição das mudanças"
git push origin main

# O Vercel fará deploy automaticamente!
```

## ⚡ Variáveis de Ambiente (Se necessário no futuro)

Se precisar adicionar variáveis de ambiente:
1. Acesse o projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione suas variáveis
4. Faça redeploy

## 🐛 Troubleshooting

### Erro de Build
- Verifique se todos os pacotes estão no `package.json`
- Teste localmente: `npm run build`

### Erro 404
- Verifique se o Output Directory está como `dist`
- Verifique se o Build Command é `npm run build`

### API não funciona
- A API já está configurada no código
- Não precisa de variáveis de ambiente
- Verifique o console do navegador para erros

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/

---

**Desenvolvido com ❤️ para TotalPass**

