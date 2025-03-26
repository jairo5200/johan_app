<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Log;
use Inertia\Inertia;
use App\Models\User;
use App\Models\AccessAttempt;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    /**
     * Muestra una lista de todos los logs registrados.
     * 
     * Este método obtiene todos los registros de logs de la base de datos, ordenados de forma descendente por la fecha 
     * de creación, y los pasa a la vista principal del log. Además, obtiene el usuario autenticado que realiza la acción.
     * Luego, los datos se pasan al front-end a través de Inertia para renderizar la vista correspondiente.
     * 
     * @return \Inertia\Response La vista principal con la lista de logs y el usuario autenticado.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function index()
    {

        // Obtener el usuario autenticado que realiza la acción
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
        
        // Obtener todos los logs ordenados por fecha de creación (descendente)
        $logs = Log::orderBy('created_at', 'desc')->get();

        $notificacionesActivas = [];
        if ($userAuth->role == 'super_admin') {
            $notificacionesActivas = Log::where('state', 'active')->get();
        }

        // Devolver la vista React utilizando Inertia y pasar los datos necesarios al front-end
        return Inertia::render('logs/Index', [
            'logs' => $logs,
            'userAuth' => $userAuth,
            'notificacionesActivas' => $notificacionesActivas,
        ]);
    }

    /**
     * Actualiza el estado de un log específico a "inactive".
     * 
     * Este método busca un log en la base de datos por su ID, y luego cambia su estado a 'inactive'. 
     * Después de realizar este cambio, guarda el registro actualizado en la base de datos.
     * 
     * @param int $id El ID del log a actualizar.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-25
     */
    public function update($id)
    {
        // Obtener el log por su ID. Si no se encuentra, se lanzará una excepción 404.
        // Este método busca el registro en la base de datos utilizando el ID proporcionado.
        $log = Log::findOrFail($id);

        // Cambiar el estado del log a 'inactive'.
        // Este cambio refleja que el log ya no está activo o que ha sido desactivado por alguna razón.
        $log->state = 'inactive';

        // Guardar el log con el nuevo estado 'inactive' en la base de datos.
        // El método 'save' persistirá los cambios realizados en el objeto 'Log'.
        $log->save();
    }

}
