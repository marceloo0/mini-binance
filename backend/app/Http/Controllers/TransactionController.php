<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tx) {
                return [
                    'id' => (string) $tx->id,
                    'type' => $tx->type,
                    'fiatAmountBrl' => (float) $tx->fiat_amount_brl,
                    'cryptoAmountBtc' => (float) $tx->crypto_amount_btc,
                    'executedPriceBrl' => (float) $tx->executed_price_brl,
                    'createdAt' => $tx->created_at->toISOString(),
                ];
            });

        return response()->json($transactions);
    }
}
