<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment('Simplify trading.');
})->purpose('Display an inspiring quote');
