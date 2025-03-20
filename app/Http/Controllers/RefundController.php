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
     * Display a listing of the resource.
     */
    public function index()
    {
        $refunds = Refund::all();
        // Devolver la vista React usando Inertia
        return Inertia::render('refunds/Index',[
            'refunds' => $refunds,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Obtenemos el usuario que realiza la accion
        $userAuth = User::findOrFail(Auth::id());
        // Validación de los datos de la solicitud
        $validatedData = $request->validate([
            'reason' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'product' => 'required|string|max:255',
            'refundDate' => 'required|date', // Validación de la fecha
        ],[
            'product.required' => 'Debe seleccionar un producto.',
            'refundDate.required' => 'La fecha de devolución es obligatoria.',
            'reason.required' => 'el motivo de la devolucion es obligatorio.',
            'client.required' => 'El cliente es obligatorio.',
        ]);

        // Buscar el producto por nombre (o id si usas product_id)
        $product = Product::where('name', $validatedData['product'])->first();

        // Verificar si el producto existe
        if (!$product) {
            return back()->withErrors(['error' => 'Producto no encontrado']);
        }

        // Devolver 1 unidad al stock del producto
        $product->stock += 1;

        // Guardar el producto con el nuevo stock
        $product->save();

        // Crear el reembolso en la base de datos
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
                'producto' => $product->name,// el producto a reembolsar
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

        // Retornar una redireccion
        return redirect()->route('sales.index')->with('success', 'Reembolso registrado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
