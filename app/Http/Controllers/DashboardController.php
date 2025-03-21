<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // obtenemos una lista de total ventas por dia
        $salesByDay = Sale::select(DB::raw('sale_date, SUM(total) as total_sales'))
            ->groupBy('sale_date')
            ->orderBy('sale_date')  // Ordena por fecha, si lo necesitas
            ->get();
        
        // obtenemos una lista de total ventas por semana hasta el 2025-01-01
        $salesByWeek = Sale::select(DB::raw('
            FLOOR(DATEDIFF(sale_date, "2025-01-01") / 7) as week_group, 
            SUM(total) as total_sales, 
            MIN(sale_date) as start_date,
            MAX(sale_date) as end_date
        '))
        ->groupBy(DB::raw('FLOOR(DATEDIFF(sale_date, "2025-01-01") / 7)'))
        ->orderBy('week_group')
        ->get();
        
        // obtenemos una lista de total ventas por mes
        $salesByMonth = Sale::select(DB::raw('
            YEAR(sale_date) as year,
            MONTH(sale_date) as month,
            SUM(total) as total_sales
        '))
        ->groupBy(DB::raw('YEAR(sale_date), MONTH(sale_date)'))
        ->orderBy('year')
        ->orderBy('month')
        ->get();

        
        // Obtener los productos
        $products = Product::where('state', 'active')->get();

        // Devolver la vista React usando Inertia y pasar los productos como datos
        return Inertia::render('Dashboard', [
            'products' => $products,
            'salesDay' => $salesByDay,
            'salesWeek' => $salesByWeek,
            'salesMonth' => $salesByMonth,
        ]);
    }

}
