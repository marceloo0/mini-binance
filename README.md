# 🚀 Mini Binance - Plataforma de Trading (POC Nível Sênior)

Aplicação completa de compra e venda de Bitcoin (BTC) desenvolvida com **React Native / Expo** no front-end mobile e **Laravel 11** no back-end.

---

## 📁 Estrutura Global do Repositório

```
test-pratic/
├── mini-binance-poc/         # App Mobile React Native / Expo (Clean Arch Lite)
│   ├── src/
│   │   ├── app/              # Expo Router (Rotas finas)
│   │   ├── data/             # Adapters HTTP, Axios e Storage Seguro
│   │   ├── domain/           # Models, Ports e React Queries
│   │   └── presentation/     # Screens, Components e Zustand Stores
│   ├── app.json
│   ├── package.json
│   ├── pnpm-lock.yaml        # Gerenciador PNPM
│   └── tsconfig.json
├── backend/                  # API Restful em Laravel 11 + Docker
│   ├── app/
│   │   ├── Http/Controllers/ # Auth, Wallet, Market, Trade e Transactions
│   │   ├── Models/           # User, Wallet, Transaction
│   │   └── Services/         # TradeService com DB::transaction e lockForUpdate()
│   ├── routes/api.php
│   ├── docker-compose.yml
│   └── Dockerfile
├── README.md                 # Documentação Principal
├── DEPLOYMENT.md             # Guia de Implantação e Deploy
└── implementation_plan.md    # Especificação Arquitetural Sênior
```

---

## 📱 1. Como Rodar o App Mobile (com pnpm)

```bash
# 1. Acesse a pasta do mobile
cd mini-binance-poc

# 2. Instale as dependências com pnpm
pnpm install

# 3. Inicie o Expo
pnpm start

# Opções de execução:
# Pressione "i" para rodar no simulador iOS
# Pressione "a" para rodar no emulador Android
# Pressione "w" para rodar no navegador Web
```

---

## 🐘 2. Como Rodar o Backend Laravel + Redis + Postgres via Docker

```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Suba a stack containerizada
docker-compose up -d

# 3. Execute as migrações do banco
docker-compose exec app php artisan migrate
```

---

## 📄 Documentação Técnica

- [Guia de Implantação e Deploy (DEPLOYMENT.md)](./DEPLOYMENT.md)
- [Plano de Arquitetura Sênior (implementation_plan.md)](file:///Users/marcelo.barbosa/.gemini/antigravity-ide/brain/38b0b896-1158-4ffa-980e-e8b54ba08101/implementation_plan.md)
- [Walkthrough de Desenvolvimento (walkthrough.md)](file:///Users/marcelo.barbosa/.gemini/antigravity-ide/brain/38b0b896-1158-4ffa-980e-e8b54ba08101/walkthrough.md)
