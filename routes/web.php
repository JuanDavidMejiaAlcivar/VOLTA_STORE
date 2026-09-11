<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Categorías
    Route::get('categorias', [CategoriaController::class, 'index'])
        ->name('categorias.index');

    Route::get('categorias/{categoria}', [CategoriaController::class, 'show'])
        ->name('categorias.show');

    Route::post('categorias', [CategoriaController::class, 'store'])
        ->name('categorias.store');

    // Productos
    Route::get('productos/reporte-pdf', [ProductoController::class, 'generarPdf'])
        ->name('productos.pdf');

    Route::get('productos', [ProductoController::class, 'index'])
        ->name('productos.index');

    Route::post('productos', [ProductoController::class, 'store'])
        ->name('productos.store');

    Route::get('productos/{producto}', [ProductoController::class, 'show'])
        ->name('productos.show');

    Route::put('productos/{producto}', [ProductoController::class, 'update'])
        ->name('productos.update');

    Route::delete('productos/{producto}', [ProductoController::class, 'destroy'])
        ->name('productos.destroy');
});

require __DIR__.'/settings.php';