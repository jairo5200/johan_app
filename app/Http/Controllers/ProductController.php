<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener los productos
        $products = Product::all();

        // Devolver la vista React usando Inertia y pasar los productos como datos
        return Inertia::render('products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Renderizar la vista React para crear un nuevo producto
        return Inertia::render('products/Create');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'numeric',
            'image' => 'required|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ]);

       // Procesar la imagen
        if ($request->hasFile('image')) {
            // Obtener el archivo de la imagen
            $image = $request->file('image');

            // Generar un nombre único para la imagen
            $imageName = $image->getClientOriginalName();

            // Mover la imagen al directorio 'public/img'
            $image->move(public_path('img'), $imageName);
        }

        // Crear el nuevo producto con la imagen guardada
        $product = Product::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'price' => $validatedData['price'],
            'stock' => $validatedData['stock'],
            'image' => 'img/' . $imageName, // Solo guardamos la ruta relativa
        ]);

        // Redirigir o devolver la vista con el producto creado
        return redirect()->route('products.index')->with('success', 'Producto creado con éxito.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Obtener el producto por su ID
        $product = Product::findOrFail($id);

        // Renderizar la vista React usando Inertia y pasar el producto
        return Inertia::render('products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Obtener el producto por su ID
        $product = Product::findOrFail($id);

        // Renderizar la vista React para editar el producto
        return Inertia::render('products/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Obtener el producto por su ID
        $product = Product::findOrFail($id);

        // Validar los datos recibidos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id', // Si tienes categorías
            // Otros campos a validar...
        ]);

        // Actualizar el producto con los nuevos datos
        $product->update($validatedData);

        // Redirigir o devolver la vista con el producto actualizado
        return redirect()->route('products.index')->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Obtener el producto por su ID
        $product = Product::findOrFail($id);

        // Eliminar el producto
        $product->delete();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('products.index')->with('success', 'Producto eliminado con éxito.');
    }
}
