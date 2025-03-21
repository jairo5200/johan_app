<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Log;
use Inertia\Inertia;
use App\Models\User;
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
            // Redirigir al usuario a la vista de productos
            return redirect()->route('products.index');
        }
        // Verificar si el usuario tiene el rol de 'usuario'
        else if ($userAuth->role == 'admin') {
            // Redirigir al usuario a la vista de productos
            return redirect()->route('products.index');
        }
        
        // Obtener todos los logs ordenados por fecha de creación (descendente)
        $logs = Log::orderBy('created_at', 'desc')->get();

        // Devolver la vista React utilizando Inertia y pasar los datos necesarios al front-end
        return Inertia::render('logs/Index', [
            'logs' => $logs,
            'userAuth' => $userAuth,
        ]);
    }

}
