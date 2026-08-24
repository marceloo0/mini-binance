<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Usuário inicial padrão para demonstração e testes E2E
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Trader Demo',
                'password' => Hash::make('123456'),
            ]
        );

        // Carteira inicial com R$ 10.000,00 e 0 BTC conforme especificação
        Wallet::firstOrCreate(
            ['user_id' => $user->id],
            [
                'fiat_balance_brl' => 10000.00,
                'crypto_balance_btc' => 0.00000000,
            ]
        );
    }
}
