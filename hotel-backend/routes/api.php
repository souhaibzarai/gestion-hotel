<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;



// Auth
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'stats']);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);

    // Users
    Route::get('/users', [UserController::class, 'index']);         
    Route::post('/users', [UserController::class, 'store']);        
    Route::put('/users/{id}', [UserController::class, 'update']); 
    Route::delete('/users/{id}', [UserController::class, 'destroy']); 

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::put('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

    // Clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::patch('/clients/{id}', [ClientController::class, 'update']);

    // Reservations
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::patch('/reservations/{id}', [ReservationController::class, 'update']);
    Route::patch('/reservations/{id}/method', [ReservationController::class, 'updatePaymentMethod']);
    Route::get('/reservations/{id}/invoice', [ReservationController::class, 'downloadInvoice']);
});