<?php

namespace App\Http\Controllers;

use App\Models\SaleProduct;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener los productos de ventas con paginación
        $saleProducts = SaleProduct::with(['sale', 'product']);

        // Devolver la vista React usando Inertia y pasar los productos de venta
        return Inertia::render('sale_products/Index', [
            'saleProducts' => $saleProducts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Obtener las ventas y productos disponibles
        $sales = Sale::all();
        $products = Product::all();

        // Renderizar la vista React para crear una nueva relación de venta-producto
        return Inertia::render('sale_products/Create', [
            'sales' => $sales,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|integer|min:0',
        ]);

        // Crear la nueva relación entre venta y producto
        SaleProduct::create([
            'sale_id' => $validatedData['sale_id'],
            'product_id' => $validatedData['product_id'],
            'quantity' => $validatedData['quantity'],
            'price' => $validatedData['price'],
        ]);

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('sale_products.index')->with('success', 'Producto agregado a la venta con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Obtener el producto de la venta con las relaciones necesarias
        $saleProduct = SaleProduct::with(['sale', 'product'])->findOrFail($id);

        // Renderizar la vista React para mostrar los detalles de la relación venta-producto
        return Inertia::render('sale_products/Show', [
            'saleProduct' => $saleProduct
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Obtener el producto de la venta con las relaciones necesarias
        $saleProduct = SaleProduct::findOrFail($id);

        // Obtener todas las ventas y productos disponibles para la edición
        $sales = Sale::all();
        $products = Product::all();

        // Renderizar la vista React para editar la relación venta-producto
        return Inertia::render('sale_products/Edit', [
            'saleProduct' => $saleProduct,
            'sales' => $sales,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Obtener el producto de la venta por su ID
        $saleProduct = SaleProduct::findOrFail($id);

        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|integer|min:0',
        ]);

        // Actualizar la relación entre venta y producto
        $saleProduct->update([
            'sale_id' => $validatedData['sale_id'],
            'product_id' => $validatedData['product_id'],
            'quantity' => $validatedData['quantity'],
            'price' => $validatedData['price'],
        ]);

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('sale_products.index')->with('success', 'Producto actualizado en la venta con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Obtener el producto de la venta por su ID
        $saleProduct = SaleProduct::findOrFail($id);

        // Eliminar la relación de la venta y producto
        $saleProduct->delete();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('sale_products.index')->with('success', 'Producto eliminado de la venta con éxito.');
    }
}
