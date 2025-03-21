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
     * Muestra una lista de todas las ventas registradas.
     * 
     * Este método obtiene todas las ventas de la base de datos, junto con los productos y usuarios asociados a cada venta. 
     * También obtiene los productos activos disponibles en el sistema. 
     * Los datos se pasan a una vista de React usando Inertia.
     * 
     * @return \Inertia\Response La vista con la lista de ventas, productos y el usuario autenticado.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Verificar si el usuario tiene el rol de 'usuario'
        if ($userAuth->role == 'usuario') {
            // Redirigir al usuario a la vista de productos
            return redirect()->route('products.index');
        }

        // Obtener todas las ventas con los productos y usuarios asociados, ordenadas por fecha de manera descendente
        $sales = Sale::with(['products', 'user'])->orderBy('sale_date', 'asc')->get();

        // Obtener los productos activos
        $products = Product::where('state', 'active')->get();

        // Devolver la vista React usando Inertia y pasar las ventas, productos y usuario
        return Inertia::render('sales/Index', [
            'sales' => $sales,
            'products' => $products,
            'userAuth' => $userAuth,
        ]);
    }

    /**
     * Almacena una nueva venta en la base de datos.
     * 
     * Este método valida los datos del formulario, verifica el stock de los productos, 
     * actualiza el stock de los productos vendidos, crea el registro de la venta en la base de datos 
     * y registra la acción en los logs.
     * 
     * @param \Illuminate\Http\Request $request Los datos de la venta.
     * @return \Illuminate\Http\RedirectResponse Redirige a la lista de ventas con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function store(Request $request)
    {
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Validar la solicitud de datos de la venta
        $validatedData = $request->validate([
            'purchaseDate' => 'required',
            'total' => 'required|numeric|min:0',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ],[
            'products.required' => 'Debe seleccionar al menos un producto.',
        ]);
        
        // Obtener los datos validados
        $saleData = $validatedData['purchaseDate'];
        $products = $validatedData['products'];
        $total = $validatedData['total'];
        
        // Array para almacenar los valores antiguos y nuevos de los productos
        $oldValues = [];
        $newValues = [];

        // Validar el stock de cada producto y realizar las actualizaciones necesarias
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

        // Registrar la auditoría de la venta en el log
        Log::create([
            'user_name' => $userAuth->name, // Nombre del usuario que realizó la acción
            'action' => 'Venta Realizada', // Acción realizada
            'model' => 'Sale', // Modelo afectado
            'old_values' => json_encode($oldValues), // Valores antiguos (stock antes de la venta)
            'new_values' => json_encode($newValues), // Nuevos valores (stock después de la venta)
            'created_at' => now(), // Fecha y hora de la transacción
            'updated_at' => now(), // Fecha y hora de la transacción
        ]);

        // Redirigir a la lista de ventas con mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Venta creada con éxito');
    }

    /**
     * Muestra los detalles de una venta específica.
     * 
     * Este método obtiene los detalles de una venta por su ID y la pasa a la vista de React.
     * 
     * @param string $id El ID de la venta.
     * @return \Inertia\Response La vista con los detalles de la venta.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function show(string $id)
    {
        // Obtener la venta por su ID
        $sale = Sale::with('user')->findOrFail($id);

        // Renderizar la vista para mostrar los detalles de la venta
        return Inertia::render('sales/Show', [
            'sale' => $sale
        ]);
    }

    /**
     * Elimina una venta específica de la base de datos.
     * 
     * Este método elimina una venta por su ID y redirige a la lista de ventas con un mensaje de éxito.
     * 
     * @param string $id El ID de la venta a eliminar.
     * @return \Illuminate\Http\RedirectResponse Redirige a la lista de ventas con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function destroy(string $id)
    {
        // Obtener el usuario que realiza la acción
        $userAuth = user::findOrFail(Auth::id());

        // Obtener la venta por su ID
        $sale = Sale::findOrFail($id);

        // Eliminar la venta
        $sale->delete();

        // Redirigir a la lista de ventas con mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Venta eliminada con éxito.');
    }
}
