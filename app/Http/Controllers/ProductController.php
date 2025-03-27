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
     * Muestra una lista de los productos activos.
     * 
     * Este método obtiene los productos que están marcados como 'activos' en la base de datos 
     * y los pasa a la vista principal de productos. También obtiene el usuario autenticado que realiza la acción.
     * Luego, los datos se pasan al front-end utilizando Inertia para renderizar la vista correspondiente.
     * 
     * @return \Inertia\Response La vista con la lista de productos activos y el usuario autenticado.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {
        
        // Obtener el usuario autenticado que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Obtener los productos activos
        $products = Product::where('state', 'active')->get();

        $notificacionesActivas = [];
        if ($userAuth->role == 'super_admin') {
            $notificacionesActivas = Log::where('state', 'active')->get();
        }

        // Devolver la vista React usando Inertia y pasar los productos como datos
        return Inertia::render('products/Index', [
            'products' => $products,
            'userAuth' => $userAuth,
            'notificacionesActivas' => $notificacionesActivas,
        ]);
    }


    /**
     * Almacena un nuevo producto en la base de datos.
     * 
     * Este método valida los datos del formulario de creación de producto, procesa la imagen, 
     * guarda el nuevo producto en la base de datos y registra la auditoría de la transacción.
     * 
     * @param \Illuminate\Http\Request $request Los datos del formulario del nuevo producto.
     * @return \Illuminate\Http\RedirectResponse Redirige a la vista de la lista de productos con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function store(Request $request)
    {
        // Obtener el usuario autenticado que realiza la acción
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
            'image.mimes' => 'La imagen del producto debe ser de tipo jpg,jpeg,png,svg o webp',
            'image.max' => 'La imagen del producto debe ser menor a 2048 KB',
        ]);

        // Procesar la imagen
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();

            // Cambiar la ruta de destino de la imagen para guardarla en 'public_html/img'
            $image->move(public_path('../public_html/img'), $imageName);
        }

        // Crear el nuevo producto con la imagen guardada
        $product = Product::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'price' => $validatedData['price'],
            'stock' => $validatedData['stock'],
            'image' => $imageName,
        ]);

        // Registrar la auditoría de la creación
        Log::create([
            'user_name' => $userAuth->name,
            'action' => 'Crear Producto',
            'model' => 'Producto',
            'old_values' => null,
            'new_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Redirigir a la vista de la lista de productos con mensaje de éxito
        return redirect()->route('products.index')->with('success', 'Producto creado con éxito.');
    }

    /**
     * Muestra los detalles de un producto especificado por su ID.
     * 
     * Este método obtiene el producto por su ID y lo pasa a la vista correspondiente para mostrar su detalle.
     * 
     * @param string $id El ID del producto a mostrar.
     * @return \Inertia\Response La vista con los detalles del producto.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Actualiza un producto existente en la base de datos.
     * 
     * Este método valida los datos del formulario de actualización, 
     * guarda los valores anteriores del producto, actualiza los valores con los nuevos datos 
     * y registra la auditoría de la transacción.
     * 
     * @param \Illuminate\Http\Request $request Los datos del formulario de actualización.
     * @param string $id El ID del producto a actualizar.
     * @return \Illuminate\Http\RedirectResponse Redirige a la vista de la lista de productos con mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function update(Request $request, string $id)
    {
        $userAuth = User::findOrFail(Auth::id());

        $validatedData = $request->validate([
            'name' => 'required|string|unique:products,name,' . $id . '|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1',
            'stock' => 'required|numeric|min:1',
        ],[
            'name.required' => 'El nombre del producto es requerido',
            'name.unique' => 'El nombre del producto ya existe',
            'description.required' => 'La descripción del producto es requerida',
            'price.required' => 'El precio del producto es requerido',
            'price.numeric' => 'El precio del producto debe ser un número',
            'price.min' => 'El precio del producto debe ser mayor a 0',
            'stock.required' => 'El stock del producto es requerido',
            'stock.numeric' => 'El stock del producto debe ser un número',
            'stock.min' => 'El stock del producto debe ser mayor a 0',
        ]);

        $product = Product::findOrFail($id);
        $oldValues = $product->getOriginal();

        $product->name = $validatedData['name'];
        $product->description = $validatedData['description'];
        $product->price = $validatedData['price'];
        $product->stock = $validatedData['stock'];
        $product->save();

        Log::create([
            'user_name' => $userAuth->name,
            'action' => 'Actualizar Producto',
            'model' => 'Product',
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('products.index')->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Elimina un producto (lo marca como inactivo) de la base de datos.
     * 
     * Este método registra la auditoría antes de cambiar el estado del producto, 
     * elimina la imagen si existe y marca el producto como inactivo.
     * 
     * @param string $id El ID del producto a eliminar.
     * @return \Illuminate\Http\RedirectResponse Redirige a la lista de productos con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function destroy(string $id)
    {
        $userAuth = User::findOrFail(Auth::id());

        $product = Product::findOrFail($id);

        Log::create([
            'user_name' => $userAuth->name,
            'action' => 'Eliminar Producto',
            'model' => 'Product',
            'old_values' => json_encode([
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image' => $product->image,
                'state' => $product->state,
            ]),
            'new_values' => json_encode([
                'state' => 'inactive',
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $path = public_path('../public_html/img/' . $product->image);

        if (file_exists($path)) {
            unlink($path);
        }

        $product->name = time() . '_'.$product->name;
        $product->state = 'inactive';
        $product->save();

        return redirect()->route('products.index')->with('success', 'Producto marcado como inactivo con éxito.');
    }
}
