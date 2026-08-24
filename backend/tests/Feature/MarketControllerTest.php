<?php

namespace Tests\Feature;

use Tests\TestCase;

class MarketControllerTest extends TestCase
{
    public function test_get_btc_price_returns_valid_market_ticker(): void
    {
        $response = $this->getJson('/api/market/btc');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'priceBrl',
                'change24hPercentage',
                'timestamp',
            ]);

        $this->assertIsNumeric($response->json('priceBrl'));
        $this->assertGreaterThan(0, $response->json('priceBrl'));
    }
}
