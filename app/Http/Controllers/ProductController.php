<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener los productos
        $products = Product::where('state', 'active')->get();

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
        // Obtenemos el usuario que realiza la accion
        $userAuth = User::findOrFail(Auth::id());

        // Validar los datos del formulario
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1',
            'stock' => 'required|numeric|min:1',
            'image' => 'required|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ],[
            'name.required' => 'El nombre del producto es requerido',
            'name.unique' => 'El nombre del producto ya existe',
            'description.required' => 'La descripción del producto es requerida',
            'price.required' => 'El precio del producto es requerido',
            'stock.required' => 'El stock del producto es requerido',
            'price.min' => 'El precio del producto debe ser mayor a 0',
            'stock.min' => 'El stock del producto debe ser mayor a 0',
            'image.required' => 'La imagen del producto es requerida',
            'image.image' => 'el archivo subido no es una imagen',
            'image.mimes' => 'La imagen del producto debe ser una imagen de tipo jpg,jpeg, png, svg o webp',
            'image.max' => 'La imagen del producto debe ser menor a 2048 KB',
        ]);


       // Procesar la imagen
        if ($request->hasFile('image')) {
            // Obtener el archivo de la imagen
            $image = $request->file('image');

            // Generar un nombre único para la imagen
            $imageName = time() . '_' . $image->getClientOriginalName();

            // Mover la imagen al directorio 'public/img'
            $image->move(public_path('img'), $imageName);
        }

        // Crear el nuevo producto con la imagen guardada
        $product = Product::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'price' => $validatedData['price'],
            'stock' => $validatedData['stock'],
            'image' => $imageName, // Solo guardamos la ruta relativa
        ]);

        // Registrar la auditoría de la transacción
        Log::create([
            'user_name' => $userAuth->name,
            'action' => 'Crear Producto',
            'model' => 'Producto',
            'old_values' => null, // En este caso es un nuevo registro, por lo que no hay valores antiguos
            'new_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
            ]),
            'created_at' => now(), // Se registra la fecha y hora de la acción
            'updated_at' => now(), // Se registra la fecha y hora de la acción
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
    public function update(Request $request, string $id){
        dd($request->all());
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Validar los datos del formulario
        $validatedData = $request->validate([
            'name' => 'required|string|unique:products,name|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1',
            'stock' => 'required|numeric|min:1',
        ],[
            'name.required' => 'El nombre del producto es requerido',
            'name.unique' => 'El nombre del producto ya existe',
            'description.required' => 'La descripción del producto es requerida',
            'price.required' => 'El precio del producto es requerido',
            'price.numeric' => 'El precio del producto debe ser un numero',
            'price.min' => 'El precio del producto debe ser mayor a 0',
            'stock.required' => 'El stock del producto es requerido',
            'stock.numeric' => 'El stock del producto debe ser un numero',
            'stock.min' => 'El stock del producto debe ser mayor a 0',
        ]);

        // Obtener el producto existente
        $product = Product::findOrFail($id);

        // Guardar los valores antiguos del producto
        $oldValues = $product->getOriginal();

        // Actualizar el resto de los campos del producto
        $product->name = $validatedData['name'];
        $product->description = $validatedData['description'];
        $product->price = $validatedData['price'];
        $product->stock = $validatedData['stock'];


        // Guardar el producto actualizado
        $product->save();

        // Registrar la auditoría de la transacción (Actualización)
        Log::create([
            'user_name' => $userAuth->name,
            'action' => 'Actualizar Producto',
            'model' => 'Product',
            'old_values' => json_encode($oldValues), // Los valores anteriores antes de la actualización
            'new_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
            ]), // Los nuevos valores después de la actualización
            'created_at' => now(), // Se registra la fecha y hora de la acción
            'updated_at' => now(), // Se registra la fecha y hora de la acción
        ]);

        // Redirigir o devolver la vista con el producto actualizado
        return redirect()->route('products.index')->with('success', 'Producto actualizado con éxito.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Obtener el producto por su ID
        $product = Product::findOrFail($id);

        // Registrar la auditoría antes de cambiar el estado
        Log::create([
            'user_name' => $userAuth->name, // Nombre del usuario
            'action' => 'Eliminar Producto', // Acción realizada
            'model' => 'Product', // Modelo afectado
            'old_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
                'state' => $product->state, // Estado anterior
            ]),
            'new_values' => json_encode([
                'state' => 'inactive', // Nuevo estado
            ]),
            'created_at' => now(), // Fecha y hora de la transacción
        ]);

        // Verificar si el producto tiene imagen y eliminarla
        if (file_exists(public_path($product->image))) {
            unlink(public_path($product->image)); // Eliminar la imagen del sistema de archivos
        }

        // Cambiar el nombre del producto
        $product->name = time() . '_'.$product->name;

        // Cambiar el estado del producto a 'inactive'
        $product->state = 'inactive';

        // Guardar los cambios en el producto
        $product->save();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('products.index')->with('success', 'Producto marcado como inactivo con éxito.');
    }
}
