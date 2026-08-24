<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_user_and_initial_wallet(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Satoshi Nakamoto',
            'email' => 'satoshi@binance.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user_id',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'satoshi@binance.com',
        ]);

        $this->assertDatabaseHas('wallets', [
            'fiat_balance_brl' => 10000.00,
            'crypto_balance_btc' => 0.00000000,
        ]);
    }

    public function test_register_validates_unique_email(): void
    {
        User::factory()->create(['email' => 'existing@binance.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Duplicate User',
            'email' => 'existing@binance.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        $user = User::factory()->create([
            'email' => 'trader@binance.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'trader@binance.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user_id',
            ]);
    }

    public function test_login_with_invalid_credentials_returns_error(): void
    {
        User::factory()->create([
            'email' => 'trader@binance.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'trader@binance.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_me_returns_authenticated_user_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'User Profile',
            'email' => 'profile@binance.com',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => 'User Profile',
                'email' => 'profile@binance.com',
            ]);
    }
}
