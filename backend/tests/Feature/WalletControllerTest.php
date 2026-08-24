<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WalletControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_wallet_returns_user_balances(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 7500.50,
            'crypto_balance_btc' => 0.02500000,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/wallet');

        $response->assertStatus(200)
            ->assertJson([
                'fiatBalanceBrl' => 7500.50,
                'cryptoBalanceBtc' => 0.02500000,
            ])
            ->assertJsonStructure([
                'fiatBalanceBrl',
                'cryptoBalanceBtc',
                'updatedAt',
            ]);
    }

    public function test_get_wallet_creates_default_wallet_if_none_exists(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/wallet');

        $response->assertStatus(200)
            ->assertJson([
                'fiatBalanceBrl' => 10000.00,
                'cryptoBalanceBtc' => 0.0,
            ]);
    }
}
