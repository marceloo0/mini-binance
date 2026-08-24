# Suíte de Testes E2E Ultra-Completa com Maestro — Mini Binance Mobile

Esta suíte fornece a automação End-to-End (E2E) **100% declarativa e completa** para demonstrar visualmente todos os recursos e fluxos da aplicação móvel **Mini Binance**.

---

## 📁 Arquivos da Suíte E2E (`mobile/.maestro/`)

| Arquivo | Descrição Detalhada do Fluxo E2E |
| :--- | :--- |
| **`00_master_flow.yaml`** | **Jornada E2E Mestre**: Ciclo de vida completo do início ao fim (Login com credenciais `demo@example.com` -> Fechamento de teclado -> Dismiss do prompt iOS -> Dashboard com saldo `R$ 10.000,00` e cotação BTC -> Ordem de Compra `R$ 2.500` -> Ordem de Venda via botão `MAX` -> Validação no Extrato de Ordens -> Logout seguro). |
| **`01_auth_flow.yaml`** | **Autenticação e Cadastro**: Validação visual da tela de login, erro para formulário de login vazio (`Preencha e-mail e senha.`), transição para cadastro (`/sign-up`), validação de formulário de cadastro vazio, retorno para login e autenticação com sucesso. |
| **`02_dashboard_flow.yaml`** | **Dashboard e Mercado**: Validação da saudação (`Olá, Trader!`), saldos `SUA CARTEIRA` (`R$ 10.000,00` BRL / `0.00000000 BTC`), banner de cotação ao vivo (`BTC / BRL`), seção de Ações Rápidas e navegação de ida e volta para Trade e Extrato. |
| **`03_trade_flow.yaml`** | **Negociação de Trade (Compra & Venda)**: Execução isolada de ordem de compra (`R$ 1.500`), estimativa de conversão, banner verde de confirmação, alternância para a aba `VENDER BTC`, seleção do saldo total pelo botão `MAX` e execução de ordem de venda. |
| **`04_transactions_flow.yaml`** | **Histórico e Extrato de Ordens**: Navegação para o extrato de ordens executadas, validação dos detalhes da taxa executada em `BTC / BRL`, confirmação dos registros de transação e retorno seguro ao Dashboard. |
| **`05_signout_flow.yaml`** | **Encerramento de Sessão (Logout)**: Autenticação de demonstração, acionamento do botão `SAIR` no cabeçalho da página e validação do redirecionamento de segurança para a tela inicial de login (`MINI BINANCE`). |

---

## 🚀 Como Executar na Apresentação

### 1. Pré-requisito: Instalar o Maestro CLI no macOS
Caso ainda não o tenha instalado:

```bash
curl -FsSL "https://get.maestro.mobile.dev" | bash
```

### 2. Iniciar a Aplicação no Emulador ou Aparelho

Abra o aplicativo no emulador Android ou iOS:

```bash
cd mobile
pnpm android   # para Android Emulator
# ou
pnpm ios       # para iOS Simulator
```

### 3. Executar o Fluxo Mestre Completo (Jornada E2E)

Para impressionar na apresentação demonstrando toda a jornada do usuário em uma única execução automatizada:

```bash
cd mobile
maestro test .maestro/00_master_flow.yaml
```

### 4. Executar Toda a Suíte em Sequência

```bash
cd mobile
maestro test .maestro/
```

### 5. Executar um Fluxo Específico Individualmente

```bash
# Apenas Login e Validações
maestro test .maestro/01_auth_flow.yaml

# Apenas Dashboard e Cotação ao Vivo
maestro test .maestro/02_dashboard_flow.yaml

# Apenas Operações de Trade (Compra/Venda)
maestro test .maestro/03_trade_flow.yaml

# Apenas Extrato de Transações
maestro test .maestro/04_transactions_flow.yaml

# Apenas Encerramento de Sessão
maestro test .maestro/05_signout_flow.yaml
```

---

## 🎛️ Modo Interativo com Espelho Visual (Maestro Studio)

Durante a apresentação, você pode abrir a interface web interativa do Maestro para demonstrar visualmente seletores e cliques ao vivo:

```bash
maestro studio
```
