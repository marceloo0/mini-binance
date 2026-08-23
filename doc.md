# 📘 Documentação Completa e Roteiro de Apresentação: Mini Binance (POC)

Este documento centraliza todas as orientações técnicas, decisões de arquitetura, funcionamento da aplicação e o **roteiro prático de apresentação** do projeto **Mini Binance**, englobando a API Restful no **Backend (Laravel 11)** e a aplicação móvel no **Frontend Mobile (React Native / Expo)**.

---

## 📌 Sumário
1. [Visão Geral da Solução](#1-visão-geral-da-solução)
2. [🐘 Backend: Arquitetura & Funcionamento](#2-backend-arquitetura--funcionamento)
3. [📱 Mobile: Arquitetura & Funcionamento](#3-mobile-arquitetura--funcionamento)
4. [🎤 Roteiro de Apresentação e Demonstração (5 Minutos)](#4-roteiro-de-apresentação-e-demonstração-5-minutos)
5. [🚀 Instruções de Execução do Projeto](#5-instruções-de-execução-do-projeto)

---

## 1. 🌐 Visão Geral da Solução

O **Mini Binance** é uma plataforma simplificada de compra e venda de Bitcoin (BTC) desenvolvida com padrão de nível sênior. O projeto atende aos requisitos de concorrência financeira, integridade de dados e alta performance de interface.

```
test-pratic/
├── backend/          # API Restful em Laravel 11 + PostgreSQL + Redis + Docker
└── mobile/           # App Mobile React Native / Expo (Clean Architecture Lite + pnpm)
```

---

## 2. 🐘 Backend: Arquitetura & Funcionamento

### **Pilha Tecnológica**
- **Framework:** Laravel 11 (PHP 8.4 FPM Alpine)
- **Banco de Dados Relacional:** PostgreSQL 15 Alpine
- **Cache & Session Storage:** Redis 7 Alpine (`predis/predis`)
- **Autenticação:** Laravel Sanctum (Tokens Bearer)
- **Containerização:** Docker & Docker Compose

### **Decisões Arquiteturais Principais**

1. **Service Layer Pattern (`TradeService.php`)**:
   - As regras financeiras complexas foram extraídas dos *Controllers* para a camada de serviços.
2. **Controle de Concorrência & Trava Pessimista (`lockForUpdate`)**:
   - Para evitar *race conditions* e gasto duplo (*double spending*), as ordens de compra/venda executam em uma transação atômica (`DB::transaction`) com bloqueio pessimista na tabela de carteiras (`Wallet::lockForUpdate()`).
3. **Cache de Mercado no Redis (`MarketController.php`)**:
   - A cotação do BTC é mantida no Redis com expiração curta, garantindo respostas rápidas sem gargalos na API externa.
4. **Saldo Inicial Garantido**:
   - Ao cadastrar um novo usuário (`AuthController.php`), uma carteira é gerada com **R$ 10.000,00** e **0 BTC**.

---

## 3. 📱 Mobile: Arquitetura & Funcionamento

### **Pilha Tecnológica**
- **Framework Base:** React Native 0.86 com Expo (SDK 57)
- **Gerenciador de Pacotes:** `pnpm`
- **Roteamento:** Expo Router (Navegação baseada no sistema de arquivos)
- **Gerenciamento de Estado:** Zustand (Client Auth/UI State) + TanStack React Query (Server Cache State)
- **Segurança de Armazenamento:** `expo-secure-store` (Keychain/Keystore)

### **Organização em Clean Architecture Lite**
```
mobile/src/
├── app/            # Expo Router (Rotas de auth e rotas privadas)
├── domain/         # Models puras, Ports e React Queries
├── data/           # Adapters HTTP Axios e SecureStorage
├── presentation/   # Screens, Componentes visuais e Zustand Stores
└── infrastructure/ # React Query Providers e configurações globais
```

### **Recursos da Interface**
- **Proteção contra Duplo Clique:** Botões de envio de ordem desabilitam automaticamente durante a requisição.
- **Invalidação Atômica de UI:** Após concluir um trade, o React Query invalida o cache de `wallet` e `transactions`, atualizando o saldo e o extrato instantaneamente.
- **Armazenamento Seguro:** O token Bearer recebido no login é salvo no armazenamento encriptado nativo (`expo-secure-store`).

---

## 🎤 4. Roteiro de Apresentação e Demonstração (5 Minutos)

Utilize este script durante reuniões de validação ou entrevistas técnicas:

### **Minuto 1: Visão Geral e Arquitetura**
> *"Apresento a POC da plataforma **Mini Binance**. Dividimos a solução em duas frentes: um backend resiliente em Laravel 11 containerizado e um aplicativo mobile React Native construído sob os conceitos de Clean Architecture Lite."*

### **Minuto 2: Demonstração da Infraestrutura e Backend**
> *"No backend, subimos o ambiente completo com `docker-compose up -d`. O grande destaque está no `TradeService.php`: para evitar requisições concorrentes alterando o saldo indevidamente, utilizamos `DB::transaction()` com `lockForUpdate()` no PostgreSQL. Além disso, a cotação do Bitcoin é mantida em cache no Redis."*

### **Minuto 3: Demonstração do App Mobile (Auth & UX)**
> *"No mobile, ao registrar uma nova conta ou fazer login, o token Bearer é salvo via `expo-secure-store`. O usuário é direcionado para o Dashboard onde visualiza o saldo inicial de R$ 10.000,00 e a cotação ao vivo do BTC controlada pelo React Query."*

### **Minuto 4: Execução de Trade e Atualização em Tempo Real**
> *"Na tela de Trade, fazemos uma simulação de compra ou venda de BTC. O formulário bloqueia duplo clique no botão. Assim que o backend responde OK, o React Query invalida a query da carteira e do extrato, atualizando a UI imediatamente sem precisar recarregar o aplicativo."*

### **Minuto 5: Extrato e Encerramento**
> *"Por fim, exibimos a tela de Extrato (`transactions`), que lista todas as operações de forma imutável. Toda a estrutura foi pensada para ser limpa, escalável e pronta para produção."*

---

## 🚀 5. Instruções de Execução do Projeto

### **Subindo o Backend**
```bash
cd backend
docker-compose up -d --build
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```
- API disponível em: `http://localhost:8000`

### **Subindo o App Mobile**
```bash
cd mobile
pnpm install
pnpm start
```
- Pressione `i` no terminal para rodar no simulador iOS ou `a` para o emulador Android.
