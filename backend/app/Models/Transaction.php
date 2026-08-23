<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // BUY ou SELL
        'fiat_amount_brl',
        'crypto_amount_btc',
        'executed_price_brl',
    ];

    protected $casts = [
        'fiat_amount_brl' => 'float',
        'crypto_amount_btc' => 'float',
        'executed_price_brl' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
