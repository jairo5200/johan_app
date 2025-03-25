<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\LogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|---------------------------------------------------------------------------
| Web Routes
|---------------------------------------------------------------------------
| Aquí es donde puedes registrar las rutas web para tu aplicación. Estas
| rutas son cargadas por el RouteServiceProvider dentro de un grupo que
| contiene el middleware "web". ¡Ahora crea algo increíble!
|
| Autor: Jairo Bastidas
| Fecha de creación: 2025-03-21
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('Login'), // Verifica si la ruta de login está disponible
        'canRegister' => Route::has('register'), // Verifica si la ruta de registro está disponible
        'laravelVersion' => Application::VERSION, // Obtiene la versión de Laravel
        'phpVersion' => PHP_VERSION, // Obtiene la versión de PHP
    ]);
});

// Rutas protegidas por autenticación
Route::middleware([
    'auth:sanctum',  // Middleware que protege la ruta con autenticación de Sanctum
    config('jetstream.auth_session'), // Middleware para la sesión de Jetstream
    'verified', // Verifica que el usuario haya confirmado su correo
])->group(function () {

    /**
     * Ruta para el Dashboard
     * @route GET /dashboard
     * Muestra el panel de control después de la autenticación.
     * Usa el controlador DashboardController.
     */
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /**
     * Rutas para gestionar productos
     */
    // Ruta para ver todos los productos
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    // Ruta para crear un nuevo producto
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    // Ruta para eliminar un producto por su ID
    Route::delete('/products/{idProduct}', [ProductController::class, 'destroy'])->name('products.destroy');
    // Ruta para actualizar un producto por su ID
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');

    /**
     * Rutas para gestionar usuarios
     */
    // Ruta para ver todos los usuarios
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    // Ruta para crear un nuevo usuario
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    // Ruta para eliminar un usuario por su ID
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    /**
     * Rutas para gestionar ventas
     */
    // Ruta para ver todas las ventas
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    // Ruta para registrar una nueva venta
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    // Ruta para eliminar una venta por su ID
    Route::delete('/sales/{id}', [SaleController::class, 'destroy'])->name('sales.destroy');


    /**
     * Rutas para gestionar reembolsos
     */
    // Ruta para ver todos los reembolsos
    Route::get('/refunds', [RefundController::class, 'index'])->name('refunds.index');
    // Ruta para registrar un nuevo reembolso
    Route::post('/refunds', [RefundController::class, 'store'])->name('refunds.store');

    /**
     * Rutas para gestionar registros de auditoría
     */
    // Ruta para ver los registros de auditoría
    Route::get('/logs', [LogController::class, 'index'])->name('logs.index');
    Route::put('/logs/{id}', [LogController::class, 'update'])->name('logs.update');
});
