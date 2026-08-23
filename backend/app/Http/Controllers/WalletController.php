<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wallet;

class WalletController extends Controller
{
    public function getWallet(Request $request)
    {
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['fiat_balance_brl' => 10000.00, 'crypto_balance_btc' => 0.00000000]
        );

        return response()->json([
            'fiatBalanceBrl' => (float) $wallet->fiat_balance_brl,
            'cryptoBalanceBtc' => (float) $wallet->crypto_balance_btc,
            'updatedAt' => $wallet->updated_at->toISOString(),
        ]);
    }
}
