<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener los productos
        $products = Product::all();

        // Devolver la vista React usando Inertia y pasar los productos como datos
        return Inertia::render('Dashboard', [
            'products' => $products
        ]);
    }

}
