# 📋 Guia de Implantação e Deploy: Mini Binance (POC)

Este guia detalha como preparar, implantar e fazer o deploy da aplicação **Mini Binance** dividida nas pastas `mini-binance-poc/` (React Native/Expo com **pnpm**) e `backend/` (Laravel 11).

---

## 📱 1. Deploy do Aplicativo Mobile (pasta `mini-binance-poc/`)

### Requisitos Prévios
- Node.js 18+ e pnpm (`pnpm -v`)
- Expo CLI / EAS (`pnpm add -g eas-cli` ou `npm install -g eas-cli`)

### A. Configuração do Ambiente
Acesse a pasta `mini-binance-poc/` e instale as dependências com `pnpm`:

```bash
cd mini-binance-poc
pnpm install
```

Conteúdo do `.env`:
```env
EXPO_PUBLIC_API_URL=https://api-minibinance.suaempresa.com
```

### B. Build para Produção com EAS (Expo Application Services)

1. **Inicializar o EAS no projeto:**
   ```bash
   eas build:configure
   ```

2. **Gerar Build Android (APK/AAB):**
   ```bash
   eas build --platform android --profile production
   ```

3. **Gerar Build iOS (IPA):**
   ```bash
   eas build --platform ios --profile production
   ```

---

## 🐘 2. Deploy do Backend Laravel (pasta `backend/`)

### Requisitos Prévios
- Servidor Linux com Docker & Docker Compose

### A. Clone & Instalação no Servidor
```bash
git clone git@github.com:seu-usuario/test-pratic.git /var/www/minibinance
cd /var/www/minibinance/backend
```

### B. Subindo os Containers
```bash
docker-compose up -d --build
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
```

---

## 🎤 3. Roteiro de Demonstração para a Apresentação ao Time

1. **Apresentação da Estrutura (1 min):**
   - Mostre a organização em `mini-binance-poc/` e `backend/`, usando **pnpm** para gerenciamento ultrarrápido no mobile.
   - Apresente a Clean Architecture: `app` (Expo Router), `presentation` (UI + Zustand), `domain` (Models/Ports puras) e `data` (Axios/Repositories).

2. **Demonstração do App Mobile (2 min):**
   - Faça login, exiba os saldos R$ 10.000,00 e 0 BTC, e a cotação LIVE do BTC.
   - Realize um trade de compra/venda, mostre a proteção contra duplo clique no botão e a revalidação imediata do extrato.

3. **Demonstração do Backend (1 min):**
   - Apresente o `TradeService.php` com `lockForUpdate()` no banco e o uso do Redis Cache no `MarketController.php`.
