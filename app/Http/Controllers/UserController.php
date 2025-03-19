<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener el user por su ID
        $user = User::findOrFail(Auth::id());

        if ($user->role == "admin") {
            // Obtener los usuarios
            $users = User::where('state', 'active')->get();

            // Devolver la vista React usando Inertia y pasar los productos como datos
            return Inertia::render('users/Index', [
                'users' => $users
            ]);
        }

    }

    // Método para almacenar el usuario en la base de datos
    public function store(Request $request)
    {
        // Obtenemos el usuario que realiza la accion
        $userAuth = User::findOrFail(Auth::id());
        // Validación de los datos del formulario
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,usuario',
        ]);

        // Crear el usuario en la base de datos
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        /* // Autenticar al usuario si lo deseas
        Auth::guard('web')->login($user); */

        // Devolver una respuesta Inertia indicando que la creación fue exitosa
        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
    // Obtener el usuario que realiza la acción
    $userAuth = User::findOrFail(Auth::id());

    // Obtener el usuario por su ID
    $user = User::findOrFail($id);

    // Verificar si el usuario está intentando eliminar su propio perfil
    if (Auth::id() == $user->id) {
        return response()->json(['message' => 'No puedes eliminar tu propio usuario'], 403);
    }

    // Verificar si el usuario existe
    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    // Cambiar el estado del usuario a 'inactivo'
    $user->state = 'inactive';

    // Modificar el nombre para que empiece con "eliminado"
    $user->name = 'Eliminado (' . $user->name . ')';

    // Guardar los cambios en la base de datos
    $user->save();

    // Redirigir o devolver la vista con el mensaje de éxito
    return redirect()->route('users.index')->with('success', 'Usuario marcado como inactivo y renombrado.');
    }
}
