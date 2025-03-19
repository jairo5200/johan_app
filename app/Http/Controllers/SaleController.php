<?php

namespace App\Http\Controllers;

use App\Models\Product;
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
        // Obtener las ventas
        $sales = Sale::all();
        // Obtener los productos
        $products = Product::all();

        // Devolver la vista React usando Inertia y pasar las ventas
        return Inertia::render('sales/Index', [
            'sales' => $sales,
            'products' => $products
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

    public function store(Request $request)
    {
        dd($request->all());
        // Validar los datos recibidos en la solicitud
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ]);
    
        // Obtener los datos validados
        $products = $validatedData['products'];
        $total = $validatedData['total'];
        $user_id = $validatedData['user_id'];
    
        // Crear la venta en la base de datos
        $sale = Sale::create([
            'total' => $total,
            'user_id' => $user_id,
        ]);
    
        // Asociar los productos a la venta
        foreach ($products as $product) {
            $sale->products()->attach($product['product_id'], [
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);
        }
    
        // Redirigir a la vista 'sales.index' con un mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Venta creada con éxito');
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
