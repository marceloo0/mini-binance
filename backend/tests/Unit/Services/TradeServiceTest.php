<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TradeService;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Exception;

class TradeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TradeService $tradeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tradeService = new TradeService();
    }

    public function test_buy_btc_fails_due_to_insufficient_brl_balance(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 100.00,
            'crypto_balance_btc' => 0.0,
        ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Saldo insuficiente em BRL para realizar esta compra.");

        $this->tradeService->buyBtc($user, 500.00, 250000.00);
    }

    public function test_sell_btc_fails_due_to_insufficient_btc_balance(): void
    {
        $user = User::factory()->create();
        Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 1000.00,
            'crypto_balance_btc' => 0.00100000,
        ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Saldo insuficiente em BTC para realizar esta venda.");

        $this->tradeService->sellBtc($user, 0.05000000, 250000.00);
    }

    public function test_buy_btc_success_updates_wallet_and_creates_transaction(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 10000.00,
            'crypto_balance_btc' => 0.0,
        ]);

        $amountBrl = 2500.00;
        $btcPrice = 250000.00;

        $transaction = $this->tradeService->buyBtc($user, $amountBrl, $btcPrice);

        $wallet->refresh();

        $this->assertEquals(7500.00, $wallet->fiat_balance_brl);
        $this->assertEquals(0.01000000, $wallet->crypto_balance_btc);

        $this->assertInstanceOf(Transaction::class, $transaction);
        $this->assertEquals('BUY', $transaction->type);
        $this->assertEquals(2500.00, $transaction->fiat_amount_brl);
        $this->assertEquals(0.01000000, $transaction->crypto_amount_btc);
        $this->assertEquals(250000.00, $transaction->executed_price_brl);
    }

    public function test_sell_btc_success_updates_wallet_and_creates_transaction(): void
    {
        $user = User::factory()->create();
        $wallet = Wallet::create([
            'user_id' => $user->id,
            'fiat_balance_brl' => 1000.00,
            'crypto_balance_btc' => 0.10000000,
        ]);

        $amountBtc = 0.05000000;
        $btcPrice = 200000.00;

        $transaction = $this->tradeService->sellBtc($user, $amountBtc, $btcPrice);

        $wallet->refresh();

        $this->assertEquals(0.05000000, $wallet->crypto_balance_btc);
        $this->assertEquals(11000.00, $wallet->fiat_balance_brl);

        $this->assertInstanceOf(Transaction::class, $transaction);
        $this->assertEquals('SELL', $transaction->type);
        $this->assertEquals(10000.00, $transaction->fiat_amount_brl);
        $this->assertEquals(0.05000000, $transaction->crypto_amount_btc);
        $this->assertEquals(200000.00, $transaction->executed_price_brl);
    }
}
