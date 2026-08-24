<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TradeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_buy_btc_endpoint_successfully_executes_order(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 10000.00,
            'crypto_balance_btc' => 0.0,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/trade/buy', [
            'amount' => 1000.00,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'transactionId',
                'type',
                'fiatAmountBrl',
                'cryptoAmountBtc',
                'executedPriceBrl',
                'createdAt',
            ])
            ->assertJson([
                'type' => 'BUY',
                'fiatAmountBrl' => 1000.00,
            ]);
    }

    public function test_buy_btc_endpoint_returns_400_when_insufficient_funds(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 500.00,
            'crypto_balance_btc' => 0.0,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/trade/buy', [
            'amount' => 5000.00,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Saldo insuficiente em BRL para realizar esta compra.',
            ]);
    }

    public function test_sell_btc_endpoint_successfully_executes_order(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 0.00,
            'crypto_balance_btc' => 0.50000000,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/trade/sell', [
            'amount' => 0.10000000,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'transactionId',
                'type',
                'fiatAmountBrl',
                'cryptoAmountBtc',
                'executedPriceBrl',
                'createdAt',
            ])
            ->assertJson([
                'type' => 'SELL',
                'cryptoAmountBtc' => 0.10000000,
            ]);
    }

    public function test_sell_btc_endpoint_returns_400_when_insufficient_crypto(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 1000.00,
            'crypto_balance_btc' => 0.01000000,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/trade/sell', [
            'amount' => 1.00000000,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Saldo insuficiente em BTC para realizar esta venda.',
            ]);
    }
}
