<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Log;

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
        $products = Product::where('state', 'active')->get();

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

    public function store(Request $request){
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());
        
        // Validar la solicitud
        $validatedData = $request->validate([
            'purchaseDate' => 'required',
            'total' => 'required|numeric|min:0',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ]);
        
        // Obtener los datos validados
        $saleData = $validatedData['purchaseDate'];
        $products = $validatedData['products'];
        $total = $validatedData['total'];
        
        // Array para almacenar los valores antiguos y nuevos de todos los productos
        $oldValues = [];
        $newValues = [];

        // Validar el stock de cada producto
        foreach ($products as $product) {
            $productModel = Product::findOrFail($product['product_id']);
            
            if ($productModel->stock < $product['quantity']) {
                return Redirect::back()->withErrors([
                    'error' => 'No hay suficiente stock para el producto: ' . $productModel->name
                ]);
            }

            // Registrar el valor antiguo del stock para el log
            $oldValues[] = [
                'product_id' => $product['product_id'],
                'product_name' => $productModel->name,
                'old_stock' => $productModel->stock,
            ];

            // Actualizar el stock de cada producto
            $productModel->stock -= $product['quantity'];
            $productModel->save();

            // Registrar el valor nuevo del stock después de la venta
            $newValues[] = [
                'product_id' => $product['product_id'],
                'product_name' => $productModel->name,
                'new_stock' => $productModel->stock,
                'quantity_sold' => $product['quantity'],
                'price' => $product['price'],
            ];
        }

        // Crear la venta en la base de datos
        $sale = Sale::create([
            'sale_date' => $saleData,
            'total' => $total,
            'user_id' => $userAuth->id,
        ]);

        // Asociar los productos a la venta
        foreach ($products as $product) {
            $sale->products()->attach($product['product_id'], [
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);
        }

        // Registrar el log de la venta (una vez con todos los productos)
        Log::create([
            'user_name' => $userAuth->name, // Usuario que realizó la acción
            'action' => 'Venta Realizada', // Acción realizada
            'model' => 'Sale', // Modelo afectado
            'old_values' => json_encode($oldValues), // Valores antiguos (stock antes de la venta)
            'new_values' => json_encode($newValues), // Nuevos valores (stock después de la venta)
            'created_at' => now(), // Fecha y hora de la transacción
            'updated_at' => now(), // Fecha y hora de la transacción
        ]);

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
