<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TradeService;
use App\Http\Controllers\MarketController;

class TradeController extends Controller
{
    protected $tradeService;
    protected $marketController;

    public function __construct(TradeService $tradeService, MarketController $marketController)
    {
        $this->tradeService = $tradeService;
        $this->marketController = $marketController;
    }

    public function buy(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|gt:0',
        ]);

        $btcPrice = $this->marketController->getBtcPrice()->getData()->priceBrl;

        try {
            $transaction = $this->tradeService->buyBtc(
                $request->user(),
                (float) $request->amount,
                $btcPrice
            );

            return response()->json([
                'transactionId' => (string) $transaction->id,
                'type' => $transaction->type,
                'fiatAmountBrl' => (float) $transaction->fiat_amount_brl,
                'cryptoAmountBtc' => (float) $transaction->crypto_amount_btc,
                'executedPriceBrl' => (float) $transaction->executed_price_brl,
                'createdAt' => $transaction->created_at->toISOString(),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function sell(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|gt:0',
        ]);

        $btcPrice = $this->marketController->getBtcPrice()->getData()->priceBrl;

        try {
            $transaction = $this->tradeService->sellBtc(
                $request->user(),
                (float) $request->amount,
                $btcPrice
            );

            return response()->json([
                'transactionId' => (string) $transaction->id,
                'type' => $transaction->type,
                'fiatAmountBrl' => (float) $transaction->fiat_amount_brl,
                'cryptoAmountBtc' => (float) $transaction->crypto_amount_btc,
                'executedPriceBrl' => (float) $transaction->executed_price_brl,
                'createdAt' => $transaction->created_at->toISOString(),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
