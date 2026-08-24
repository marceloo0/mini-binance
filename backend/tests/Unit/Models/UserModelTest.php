<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_one_wallet_relationship(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 10000.00,
            'crypto_balance_btc' => 0.0,
        ]);

        $this->assertInstanceOf(Wallet::class, $user->wallet);
        $this->assertEquals($user->id, $user->wallet->user_id);
    }

    public function test_user_has_many_transactions_relationship(): void
    {
        $user = User::factory()->create();

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'BUY',
            'fiat_amount_brl' => 1000.00,
            'crypto_amount_btc' => 0.004,
            'executed_price_brl' => 250000.00,
        ]);

        $this->assertCount(1, $user->transactions);
        $this->assertInstanceOf(Transaction::class, $user->transactions->first());
    }
}
