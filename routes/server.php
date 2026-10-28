<?php

use Illuminate\Support\Facades\Route;
use McHelper\Http\Controllers\PlayerController;

Route::get('/online-players', [PlayerController::class, 'getOnlinePlayers']);