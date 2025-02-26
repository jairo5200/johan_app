<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // Obtener los productos
       $users = User::all();

       // Devolver la vista React usando Inertia y pasar los productos como datos
       return Inertia::render('users/Index', [
           'users' => $users
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
        //
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
        // Obtener el user por su ID
        $user = User::findOrFail($id);

        // Eliminar el producto
        $user->delete();

        // Redirigir o devolver la vista con el mensaje de éxito
        return redirect()->route('users.index')->with('success', 'Usuario eliminado con éxito.');
    }
}
