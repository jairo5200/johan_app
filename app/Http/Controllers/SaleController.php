<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener las ventas con paginación (puedes ajustar el número de elementos por página)
        $sales = Sale::with('user');

        // Devolver la vista React usando Inertia y pasar las ventas
        return Inertia::render('sales/Index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Renderizar la vista React para crear una nueva venta
        return Inertia::render('sales/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id', // Asegurarse de que el usuario existe
            // Otros campos si es necesario...
        ]);

        // Crear la nueva venta
        $sale = Sale::create([
            'total' => $validatedData['total'],
            'user_id' => $validatedData['user_id'],
        ]);

        // Redirigir o devolver la vista con el producto creado
        return redirect()->route('sales.index')->with('success', 'Venta creada con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Obtener la venta por su ID
        $sale = Sale::with('user')->findOrFail($id);

        // Renderizar la vista React para mostrar los detalles de la venta
        return Inertia::render('sales/Show', [
            'sale' => $sale
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Obtener la venta por su ID
        $sale = Sale::findOrFail($id);

        // Renderizar la vista React para editar la venta
        return Inertia::render('sales/Edit', [
            'sale' => $sale
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Obtener la venta por su ID
        $sale = Sale::findOrFail($id);

        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id', // Asegurarse de que el usuario existe
        ]);

        // Actualizar los datos de la venta
        $sale->update($validatedData);

        // Redirigir o devolver la vista con el producto actualizado
        return redirect()->route('sales.index')->with('success', 'Venta actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Obtener la venta por su ID
        $sale = Sale::findOrFail($id);

        // Eliminar la venta
        $sale->delete();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Venta eliminada con éxito.');
    }
}
