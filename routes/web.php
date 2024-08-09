<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/dashboard');
});
// API process
Route::get('processauth', [App\Http\Controllers\AuthorizedController::class, 'processAuth'])->name('processauth');

Route::get('/{path?}', function () {
    return view('app');
});