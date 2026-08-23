<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fiat_balance_brl',
        'crypto_balance_btc',
    ];

    protected $casts = [
        'fiat_balance_brl' => 'float',
        'crypto_balance_btc' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
