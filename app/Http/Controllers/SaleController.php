<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener las ventas con los productos y usuarios asociados
        $sales = Sale::with(['products', 'user'])->get();
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
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());
    
        // Validar la solicitud
        $validatedData = $request->validate([
            'total' => 'required|numeric|min:0',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ]);
    
        // Obtener los datos validados
        $products = $validatedData['products'];
        $total = $validatedData['total'];
    
        foreach ($products as $product) {
            // Validamos el stock de cada producto
            $productModel = Product::findOrFail($product['product_id']);
    
            if ($productModel->stock < $product['quantity']) {
                return Redirect::back()->withErrors([
                    'error' => 'No hay suficiente stock para el producto: ' . $productModel->name
                ]);
            }
        }
    
    
        // Crear la venta en la base de datos
        $sale = Sale::create([
            'total' => $total,
            'user_id' => $userAuth->id,
        ]);
    
        // Asociar los productos a la venta y actualizar el stock
        foreach ($products as $product) {
            // Actualizar el stock de cada producto
            $productModel = Product::findOrFail($product['product_id']);
            
            // Restar la cantidad vendida del stock
            $productModel->stock -= $product['quantity'];
            $productModel->save();

            // Asociar el producto a la venta
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
        // Obtener el usuario que realiza la accion
        $userAuth = user::findOrFail(Auth::id());
        // Obtener la venta por su ID
        $sale = Sale::findOrFail($id);

        // Eliminar la venta
        $sale->delete();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Venta eliminada con éxito.');
    }
}
