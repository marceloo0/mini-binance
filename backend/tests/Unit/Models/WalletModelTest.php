<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WalletModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_wallet_belongs_to_user_relationship(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 5000.00,
            'crypto_balance_btc' => 0.02,
        ]);

        $this->assertInstanceOf(User::class, $wallet->user);
        $this->assertEquals($user->id, $wallet->user->id);
    }
}
