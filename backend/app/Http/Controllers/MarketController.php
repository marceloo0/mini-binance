<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;

class MarketController extends Controller
{
    public function getBtcPrice()
    {
        // Utilização de Redis Cache para cotação com TTL de 3 segundos (Diferencial Sênior do PDF)
        $marketData = Cache::remember('btc_market_price', 3, function () {
            $basePrice = 248500.0;
            $fluctuation = rand(-1500, 1500);
            $finalPrice = min(300000, max(200000, $basePrice + $fluctuation));

            return [
                'priceBrl' => (float) $finalPrice,
                'change24hPercentage' => (float) number_format(rand(-30, 45) / 10, 2),
                'timestamp' => now()->toISOString(),
            ];
        });

        return response()->json($marketData);
    }
}
