<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_transactions_returns_user_history(): void
    {
        $user = User::factory()->create();

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'BUY',
            'fiat_amount_brl' => 2500.00,
            'crypto_amount_btc' => 0.01000000,
            'executed_price_brl' => 250000.00,
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'SELL',
            'fiat_amount_brl' => 1000.00,
            'crypto_amount_btc' => 0.00400000,
            'executed_price_brl' => 250000.00,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/transactions');

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'type',
                    'fiatAmountBrl',
                    'cryptoAmountBtc',
                    'executedPriceBrl',
                    'createdAt',
                ],
            ]);
    }
}
