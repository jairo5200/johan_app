<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Muestra la vista principal del dashboard con varios datos de ventas e información de productos.
     * 
     * Este método obtiene los datos de ventas para diferentes periodos de tiempo (diario, semanal y mensual), 
     * así como la lista de productos activos. Luego, los datos se pasan al front-end a través de Inertia para 
     * renderizar la vista principal del dashboard.
     * 
     * @return \Inertia\Response La vista principal del dashboard con los datos de ventas y productos activos.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {
        // Obtener el usuario autenticado que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Obtener el total de ventas por día
        $salesByDay = Sale::select(DB::raw('sale_date, SUM(total) as total_sales'))
            ->groupBy('sale_date')
            ->orderBy('sale_date')  // Ordenar por fecha
            ->get();
        
        // Obtener el total de ventas por semana hasta el 2025-01-01
        $salesByWeek = Sale::select(DB::raw('
            FLOOR(DATEDIFF(sale_date, "2025-01-01") / 7) as week_group, 
            SUM(total) as total_sales, 
            MIN(sale_date) as start_date,
            MAX(sale_date) as end_date
        '))
        ->groupBy(DB::raw('FLOOR(DATEDIFF(sale_date, "2025-01-01") / 7)'))
        ->orderBy('week_group')
        ->get();
        
        // Obtener el total de ventas por mes
        $salesByMonth = Sale::select(DB::raw('
            YEAR(sale_date) as year,
            MONTH(sale_date) as month,
            SUM(total) as total_sales
        '))
        ->groupBy(DB::raw('YEAR(sale_date), MONTH(sale_date)'))
        ->orderBy('year')
        ->orderBy('month')
        ->get();

        // Obtener los productos activos
        $products = Product::where('state', 'active')->get();

        // Devolver la vista React utilizando Inertia y pasar los datos necesarios al front-end
        return Inertia::render('Dashboard', [
            'products' => $products,
            'salesDay' => $salesByDay,
            'salesWeek' => $salesByWeek,
            'salesMonth' => $salesByMonth,
            'userAuth' => $userAuth,
        ]);
    }
}
