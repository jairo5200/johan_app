<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AccessAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Log;

class UserController extends Controller
{
    /**
     * Muestra una lista de todos los usuarios activos.
     * 
     * Este método obtiene todos los usuarios activos de la base de datos 
     * y los pasa a la vista React usando Inertia, junto con el usuario autenticado.
     * 
     * @return \Inertia\Response La vista con la lista de usuarios y el usuario autenticado.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {
        // Obtener el usuario autenticado por su ID
        $userAuth = User::findOrFail(Auth::id());

        // Verificar si el usuario tiene el rol de 'usuario'
        if ($userAuth->role == 'usuario') {
            // Registrar el intento de acceso
            AccessAttempt::create([
                'user_id' => $userAuth->id,
                'route' => url()->current(), // Obtener la URL actual a la que intentan acceder
            ]);

            // Redirigir al usuario a la vista de productos
            return redirect()->route('products.index');
        }
        // Verificar si el usuario tiene el rol de 'admin'
        if ($userAuth->role == 'admin') {
            // Registrar el intento de acceso
            AccessAttempt::create([
                'user_id' => $userAuth->id,
                'route' => url()->current(), // Obtener la URL actual a la que intentan acceder
            ]);

            // Redirigir al usuario a la vista de productos
            return redirect()->route('products.index');
        }

        // Obtener todos los usuarios activos
        $users = User::where('state', 'active')->get();

        $notificacionesActivas = [];
        if ($userAuth->role == 'super_admin') {
            $notificacionesActivas = Log::where('state', 'active')->get();
        }

        // Devolver la vista React usando Inertia y pasar los usuarios y el usuario autenticado
        return Inertia::render('users/Index', [
            'users' => $users,
            'userAuth' => $userAuth,
            'notificacionesActivas' => $notificacionesActivas,
        ]);
    }

    /**
     * Almacena un nuevo usuario en la base de datos.
     * 
     * Este método valida los datos del formulario, crea un nuevo usuario 
     * y registra la acción en los logs para auditoría.
     * 
     * @param \Illuminate\Http\Request $request Los datos del usuario.
     * @return \Illuminate\Http\RedirectResponse Redirige a la lista de usuarios.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function store(Request $request)
    {
        // Obtener el usuario que realiza la acción
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

        // Redirigir a la lista de usuarios con mensaje de éxito
        return redirect()->route('users.index');
    }

    /**
     * Elimina un usuario de la base de datos.
     * 
     * Este método desactiva un usuario marcándolo como "inactivo" 
     * y renombra el usuario como "Eliminado". También registra la acción en los logs de auditoría.
     * 
     * @param string $id El ID del usuario a eliminar.
     * @return \Illuminate\Http\RedirectResponse Redirige a la lista de usuarios con un mensaje de éxito.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function destroy(string $id)
    {
        // Obtener el usuario que realiza la acción
        $userAuth = User::findOrFail(Auth::id());

        // Obtener el usuario por su ID
        $user = User::findOrFail($id);


        // Verificar si el usuario es "super_admin" y evitar que sea eliminado
        if ($user->role === 'super_admin') {
            return Redirect::back()->withErrors([
                'error' => 'No puedes eliminar a un usuario con rol de super_admin.'
            ]);
        }

        // Verificar si el usuario está intentando eliminar su propio perfil
        if(auth()->id() == $user->id) {
            // Redirigir con un mensaje de error si el usuario intenta eliminarse a sí mismo
            return Redirect::back()->withErrors([
                'error' => 'No puedes eliminar tu propio usuario'
            ]);
        }

        // Verificar si el usuario existe
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Registrar los valores antiguos para la auditoría
        $oldValues = [
            'name' => $user->name,
            'email' => $user->email,
            'state' => $user->state,
        ];

        // Cambiar el estado del usuario a 'inactivo'
        $user->state = 'inactive';

        // Modificar el nombre del usuario para marcarlo como eliminado
        $user->name = 'Eliminado (' . $user->name . ')';

        // Borrar el correo electrónico (Gmail) del usuario
        $user->email = null;

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
