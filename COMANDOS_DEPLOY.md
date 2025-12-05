# ⚡ Comandos Rápidos para Deploy

## 🔥 O que já está pronto:
- ✅ Git inicializado
- ✅ Commit inicial feito
- ✅ Branch main configurada

## 📋 Execute estes comandos:

### 1. Criar Repositório no GitHub
Acesse: https://github.com/new
- Nome: `menu-alimentar`
- Visibilidade: Public ou Private
- **NÃO marque nenhuma opção**
- Clique em "Create repository"

### 2. Conectar ao GitHub

Copie a URL do seu repositório e execute:

```bash
cd /Users/jlptenorio/Documents/starbem/menu-alimentar

# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/menu-alimentar.git

# Enviar código
git push -u origin main
```

### 3. Deploy no Vercel (Opção 1 - Interface)

1. Acesse: https://vercel.com
2. Login com GitHub
3. **"Add New..."** → **"Project"**
4. Selecione `menu-alimentar`
5. Clique em **"Deploy"**

Pronto! 🎉

---

### 3. Deploy no Vercel (Opção 2 - CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/jlptenorio/Documents/starbem/menu-alimentar
vercel

# Para produção
vercel --prod
```

## 🌐 Resultado

Você receberá uma URL como:
```
https://menu-alimentar-xxx.vercel.app
```

## 🔄 Para Atualizar Depois

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

O Vercel fará deploy automaticamente! ✨

