<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\HomeController;
use Inertia\Inertia;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/products/{id}', [HomeController::class, 'productPage'])->name('product.show');


Route::inertia('/admin/products', 'admin/products/Index')->name('admin.products.index');
Route::inertia('/admin/products/create', 'admin/products/Form')->name('admin.products.create');
Route::get('/admin/products/{id}/edit', [HomeController::class, 'edit'])->name('admin.products.edit');
Route::get('/admin/products/{id}', [HomeController::class, 'delete'])->name('admin.products.delete');


require __DIR__.'/settings.php';
