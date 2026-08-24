# 🚀 Mini Binance — Plataforma de Trading Crypto (POC Nível Sênior)

Aplicação completa e de nível de produção para negociação em tempo real de **Bitcoin (BTC/BRL)**, composta por um aplicativo móvel construído em **React Native, Expo Router v4 e TypeScript**, consumindo um backend micro-containerizado em **Laravel (PHP 8.4), PostgreSQL 15 e Redis 7**.

---

## 📁 Estrutura do Repositório

```text
test-pratic/
├── mobile/                   # Aplicação Móvel React Native / Expo (Clean Architecture)
│   ├── .maestro/             # Suíte Declarativa de Testes E2E (Maestro CLI - 6 fluxos completos)
│   ├── src/
│   │   ├── app/              # Expo Router (Rotas finas desacopladas)
│   │   ├── data/             # Repositórios HTTP (Axios), Storage Seguro e Interceptores
│   │   ├── domain/           # Entidades puras, Interfaces de Portas e React Queries
│   │   ├── infrastructure/   # Provedores globais de contexto
│   │   └── presentation/     # Telas, Componentes Visuais e Zustand Stores
│   ├── package.json
│   ├── pnpm-lock.yaml        # Gerenciador de Pacotes PNPM
│   └── tsconfig.json
├── backend/                  # API Restful em Laravel + Docker Stack
│   ├── app/
│   │   ├── Http/Controllers/ # Auth, Wallet, Market, Trade e Transactions
│   │   ├── Models/           # User, Wallet, Transaction
│   │   └── Services/         # TradeService com DB::transaction e Lock de Concorrência
│   ├── database/seeders/     # DatabaseSeeder oficial com a conta de testes populada
│   ├── routes/api.php
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md                 # Documentação Executiva Principal
```

---

## 🏛️ Arquitetura de Software & Decisões de Engenharia

O projeto foi projetado com práticas modernas de desenvolvimento de software para garantir escalabilidade, manutenibilidade e confiabilidade financeira:

1. **Clean Architecture / Hexagonal Architecture (Ports & Adapters)**:
   - **Camada de Domínio (`domain/`)**: Regras de negócio, modelos de dados e interfaces de portas agnósticas de framework.
   - **Camada de Dados (`data/`)**: Adapters de comunicação HTTP via Axios, persistência segura com `expo-secure-store` e suporte a **resiliência offline com fallback**.
   - **Camada de Apresentação (`presentation/`)**: Componentes visuais desacoplados e gerenciamento de estado previsível.

2. **Gerenciamento de Estado de Servidor (TanStack React Query v5)**:
   - Caching inteligente, refetch em background e invalidação de estado instantânea ao executar ordens de compra/venda sem necessidade de recarregamentos manuais.

3. **Segurança & Idempotência Financeira**:
   - Cabeçalho `idempotencyKey` enviado em todas as ordens de trade para evitar execuções duplicadas no backend em conexões oscilantes.

4. **Navegação por Arquivos com Expo Router v4**:
   - Separação clara entre rotas públicas `(auth)` e rotas autenticadas protegidas `(private)`.

---

## 🛠️ Stack Tecnológica

### Mobile (Front-end)
- **Framework**: React Native `0.76.7` / Expo `52.0.37` (Expo Router `4.0.17`)
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: TanStack React Query `v5` + Zustand `v5`
- **Comunicação HTTP**: Axios `1.7.9` (com interceptores de autorização e `Accept: application/json`)
- **Armazenamento Seguro**: Expo Secure Store `57.0.1`
- **Testes Unitários**: Jest + React Native Testing Library
- **Testes E2E**: Maestro CLI

### Backend (API & Infraestrutura)
- **Framework**: Laravel PHP `8.4` (API RESTful)
- **Banco de Dados**: PostgreSQL 15
- **Cache & Fila**: Redis 7
- **Conteinerização**: Docker Compose

---

## ⚡ Como Rodar o Projeto (Passo a Passo)

### 1. Iniciar o Backend no Docker

```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Inicie a stack de contêineres no Docker
docker compose up -d

# 3. Popule o banco de dados com a conta de demonstração inicial (R$ 10.000,00)
docker compose exec app php artisan db:seed --force
```

### 2. Iniciar o App Mobile (com PNPM)

```bash
# 1. Acesse a pasta do mobile
cd mobile

# 2. Instale as dependências
pnpm install

# 3. Inicie o Expo Metro Bundler
pnpm dev

# Opções no terminal do Expo:
# Pressione "i" para abrir no simulador iOS
# Pressione "a" para abrir no emulador Android
```

---

## 🧪 Suíte de Testes Automatizados

A aplicação conta com garantia de qualidade em 2 níveis de testes automatizados:

### 🟩 A. Testes Unitários e de Integração (Jest)
Testam a integridade dos repositórios, stores, formatadores e componentes de tela.

```bash
cd mobile
pnpm test
```
> **Resultado**: 16 Suítes de Testes / 69 Testes Individuais — **100% de Aprovação**.

### 🟩 B. Testes End-to-End Automatizados (Maestro CLI)
Testam o comportamento real da aplicação no simulador/emulador de ponta a ponta.

```bash
cd mobile
pnpm test:e2e
```

| Arquivo E2E | Descrição do Fluxo Automatizado |
| :--- | :--- |
| **`00_master_flow.yaml`** | **Jornada Mestre Completa**: Login -> Dashboard -> Compra de BTC -> Venda de BTC via botão MAX -> Extrato -> Logout. |
| **`01_auth_flow.yaml`** | **Autenticação**: Validação de erros em formulários vazios, transição para cadastro e login com sucesso. |
| **`02_dashboard_flow.yaml`** | **Dashboard**: Validação de saldos Fiat (BRL) e Crypto (BTC), cotação ao vivo e navegação rápida. |
| **`03_trade_flow.yaml`** | **Negociação de Trade**: Ordem de Compra, estimativa de conversão, alternância para Venda e botão MAX. |
| **`04_transactions_flow.yaml`** | **Histórico de Ordens**: Consulta ao extrato de ordens executadas com badges `COMPRA` e `VENDA`. |
| **`05_signout_flow.yaml`** | **Encerramento de Sessão**: Logout seguro e redirecionamento para a tela inicial. |

---

## 🔑 Credenciais Padrão de Acesso

Ao rodar o `db:seed` no backend ou utilizar a aplicação em modo de demonstração, utilize as seguintes credenciais:

- **E-mail**: `demo@example.com`
- **Senha**: `123456`
- **Saldo Inicial**: `R$ 10.000,00 BRL` | `0.00000000 BTC`
