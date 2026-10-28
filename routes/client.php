<?php

use Illuminate\Support\Facades\Route;
use McHelper\Http\Controllers\StatusController;

// Final URL: GET /api/client/extensions/mc-helper/status
Route::get('/status', StatusController::class)->name('status');
