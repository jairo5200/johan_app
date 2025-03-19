<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Log;

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
    public function store(Request $request){
        // Obtenemos el usuario que realiza la acción
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

        // Registrar la auditoría antes de crear el usuario
        Log::create([
            'user_name' => $userAuth->name, // Nombre del usuario que realizó la acción
            'action' => 'Crear Usuario', // Acción realizada
            'model' => 'User', // Nombre del modelo afectado
            'old_values' => null, // No hay valores antiguos al crear
            'new_values' => json_encode([ // Se almacenan los nuevos valores
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]),
            'created_at' => now(), // Fecha y hora de la transacción
            'updated_at' => now(), // Fecha y hora de la transacción
        ]);

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

        // Registrar los valores antiguos para la auditoría
        $oldValues = [
            'name' => $user->name,
            'email' => $user->email,
            'state' => $user->state,
        ];

        // Cambiar el estado del usuario a 'inactivo'
        $user->state = 'inactive';

        // Modificar el nombre para que empiece con "eliminado"
        $user->name = 'Eliminado (' . $user->name . ')';

        // Guardar los cambios en la base de datos
        $user->save();

        // Registrar la auditoría de la transacción
        Log::create([
            'user_name' => $userAuth->name, // Nombre del usuario que realizó la acción
            'action' => 'Desactivar Usuario', // Acción realizada
            'model' => 'User', // Nombre del modelo afectado
            'old_values' => json_encode($oldValues), // Los valores antes de la modificación
            'new_values' => json_encode([ // Se almacenan los nuevos valores
                'name' => $user->name,
                'email' => $user->email,
                'state' => $user->state,
            ]),
            'created_at' => now(), // Fecha y hora de la transacción
            'updated_at' => now(), // Fecha y hora de la transacción
        ]);

        // Redirigir a la página de usuarios con un mensaje de éxito
        return redirect()->route('users.index')->with('success', 'Usuario marcado como inactivo y renombrado.');
    }
}
