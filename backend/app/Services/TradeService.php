<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Exception;

class TradeService
{
    /**
     * Executa ordem de compra de BTC utilizando trava pessimista (Pessimistic Locking / lockForUpdate)
     * para garantir controle estrito de concorrência e evitar race conditions / double spending.
     */
    public function buyBtc(User $user, float $amountBrl, float $currentBtcPrice): Transaction
    {
        return DB::transaction(function () use ($user, $amountBrl, $currentBtcPrice) {
            // Trava a linha da carteira no banco de dados para evitar leituras/escritas concorrentes
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if ($wallet->fiat_balance_brl < $amountBrl) {
                throw new Exception("Saldo insuficiente em BRL para realizar esta compra.");
            }

            $cryptoAcquired = round($amountBrl / $currentBtcPrice, 8);

            // Atualiza saldos atomicamente
            $wallet->fiat_balance_brl -= $amountBrl;
            $wallet->crypto_balance_btc += $cryptoAcquired;
            $wallet->save();

            // Grava registro no extrato
            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'BUY',
                'fiat_amount_brl' => $amountBrl,
                'crypto_amount_btc' => $cryptoAcquired,
                'executed_price_brl' => $currentBtcPrice,
            ]);
        });
    }

    /**
     * Executa ordem de venda de BTC com trava pessimista no banco.
     */
    public function sellBtc(User $user, float $amountBtc, float $currentBtcPrice): Transaction
    {
        return DB::transaction(function () use ($user, $amountBtc, $currentBtcPrice) {
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if ($wallet->crypto_balance_btc < $amountBtc) {
                throw new Exception("Saldo insuficiente em BTC para realizar esta venda.");
            }

            $fiatEarned = round($amountBtc * $currentBtcPrice, 2);

            $wallet->crypto_balance_btc -= $amountBtc;
            $wallet->fiat_balance_brl += $fiatEarned;
            $wallet->save();

            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'SELL',
                'fiat_amount_brl' => $fiatEarned,
                'crypto_amount_btc' => $amountBtc,
                'executed_price_brl' => $currentBtcPrice,
            ]);
        });
    }
}
