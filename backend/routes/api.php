<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChekOtpCodeController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1.0.0')->group(function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->name("login");
    Route::post('check/otp-code', [ChekOtpCodeController::class, 'check']);

    Route::middleware(['auth:sanctum'])->group(function () {
        // Route::get('users', [UserController::class, 'index']);
        // Route::get('logout', [AuthController::class, 'logout']);
        Route::get('show/profile', [AuthController::class, 'showProfile']);
        Route::get('get/groups', [GroupController::class, 'index']);
        Route::get('get/members/{id}', [MemberController::class, 'show']);
        Route::get('get/groups/{id}', [GroupController::class, 'show']);
        Route::get('get/chat/{id}', [ChatController::class, 'show']);
        Route::post('create/group', [GroupController::class, 'create']);
        Route::post('create/member', [MemberController::class, 'create']);
        Route::post('send/chat', [ChatController::class, 'send']);
    });
});
