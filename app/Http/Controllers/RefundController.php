<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Refund;
use App\Models\Product;
use App\Models\Log;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    /**
     * Muestra una lista de los reembolsos registrados.
     * 
     * Este método obtiene todos los reembolsos de la base de datos y los pasa a la vista React usando Inertia. 
     * También obtiene el usuario autenticado que realiza la acción.
     * 
     * @return \Inertia\Response La vista con la lista de reembolsos y el usuario autenticado.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {
        // Obtener el usuario autenticado que realiza la acción
        $userAuth = User::findOrFail(Auth::id());
        
        // Obtener todos los reembolsos ordenados por la fecha de manera descendente
        $refunds = Refund::orderBy('created_at', 'asc')->get();

        // Devolver la vista React usando Inertia y pasar los reembolsos y el usuario
        return Inertia::render('refunds/Index', [
            'refunds' => $refunds,
            'userAuth' => $userAuth,
        ]);
    }


    /**
     * Almacena un nuevo reembolso en la base de datos.
     * 
     * Este método valida los datos recibidos del formulario de reembolso, 
     * busca el producto asociado al reembolso, actualiza el stock del producto 
     * y crea el registro del reembolso en la base de datos. También registra la 
     * auditoría de la acción en el log.
     * 
     * @param \Illuminate\Http\Request $request Los datos del formulario del reembolso.
     * @return \Illuminate\Http\RedirectResponse Redirige a la vista de ventas con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function store(Request $request)
    {
        // Obtener el usuario autenticado que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Validación de los datos del formulario de reembolso
        $validatedData = $request->validate([
            'reason' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'product' => 'required|string|max:255',
            'refundDate' => 'required|date', // Validación de la fecha de reembolso
        ],[
            'product.required' => 'Debe seleccionar un producto.',
            'refundDate.required' => 'La fecha de devolución es obligatoria.',
            'reason.required' => 'El motivo de la devolución es obligatorio.',
            'client.required' => 'El cliente es obligatorio.',
        ]);

        // Buscar el producto por nombre (o ID si usas product_id)
        $product = Product::where('name', $validatedData['product'])->first();

        // Verificar si el producto existe
        if (!$product) {
            return back()->withErrors(['error' => 'Producto no encontrado']);
        }

        // Aumentar el stock del producto en 1 unidad
        $product->stock += 1;

        // Guardar el producto con el nuevo stock
        $product->save();

        // Crear el registro del reembolso en la base de datos
        $refund = Refund::create([
            'reason' => $validatedData['reason'],
            'client' => $validatedData['client'],
            'product' => $validatedData['product'],
            'refund_date' => $validatedData['refundDate'], // Guardar la fecha del reembolso
        ]);

        // Registrar la auditoría de la transacción en el log
        Log::create([
            'user_name' => $userAuth->name, // Nombre del usuario que realiza la acción
            'action' => 'Registrar Reembolso', // Acción realizada
            'model' => 'Refund', // Nombre del modelo (Refund)
            'old_values' => json_encode([ // Antes de la acción, no hay cambios anteriores
                'producto' => $product->name, // El producto a reembolsar
                'stock' => $product->stock - 1, // El stock antes del reembolso
            ]),
            'new_values' => json_encode([ // Después de la acción
                'reason' => $refund->reason,
                'client' => $refund->client,
                'product' => $refund->product,
                'refund_date' => $refund->refund_date,
                'stock' => $product->stock, // Nuevo stock después del reembolso
            ]),
            'created_at' => now(), // Fecha y hora de la acción
            'updated_at' => now(), // Fecha y hora de la acción
        ]);

        // Redirigir a la vista de ventas con mensaje de éxito
        return redirect()->route('sales.index')->with('success', 'Reembolso registrado con éxito.');
    }

}
