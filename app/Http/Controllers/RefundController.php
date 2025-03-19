<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Return;
use Inertia\Inertia;

class RefundController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Devolver la vista React usando Inertia
        return Inertia::render('refunds/Index');
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
       dd($request->all());
       // Validación de los datos de la solicitud
       $validatedData = $request->validate([
        'reason' => 'required|string|max:255',
        'client' => 'required|string|max:255',
        'product' => 'required|string|max:255',
        'refundDate' => 'required|date', // Validación de la fecha
        ]);

        // Crear el reembolso en la base de datos
        $refund = Refund::create([
            'reason' => $validatedData['reason'],
            'client' => $validatedData['client'],
            'product' => $validatedData['product'],
            'refund_date' => $validatedData['refundDate'], // Guardar la fecha del reembolso
        ]);

        // Retornar una respuesta o redirigir
        return response()->json(['message' => 'Reembolso registrado con éxito', 'data' => $refund]);
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
