<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\TransactionController;

/*
|--------------------------------------------------------------------------
| API Routes - Mini Binance Platform
|--------------------------------------------------------------------------
*/

// Rotas Públicas de Autenticação e Mercado
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/market/btc', [MarketController::class, 'getBtcPrice']);

// Rotas Protegidas (Requer Token Sanctum / JWT)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/wallet', [WalletController::class, 'getWallet']);
    Route::post('/trade/buy', [TradeController::class, 'buy']);
    Route::post('/trade/sell', [TradeController::class, 'sell']);
    Route::get('/transactions', [TransactionController::class, 'index']);
});
