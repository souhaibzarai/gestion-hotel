<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;



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
