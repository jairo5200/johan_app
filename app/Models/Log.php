<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    /**
     * Usamos el trait HasFactory para habilitar la creación de fábricas de modelos para pruebas.
     */
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'user_name',     // Nombre del usuario que realiza la acción
        'action',        // Acción realizada (por ejemplo, 'Crear Usuario', 'Eliminar Producto', etc.)
        'model',         // Modelo que se ha modificado (por ejemplo, 'User', 'Product', 'Sale', etc.)
        'old_values',    // Valores anteriores antes de que se realizara la acción (se almacena como JSON)
        'new_values',   // Nuevos valores después de realizar la acción (se almacena como JSON)
        'state',        // estado del log 
        'created_at',    // Fecha y hora en que se realizó la acción
        'updated_at',    // Fecha y hora en que se actualizó el registro del log (generalmente igual a created_at)
    ];

    /**
     * Descripción del Modelo `Log`
     * 
     * Propósito: Este modelo está diseñado para almacenar logs de auditoría,
     * es decir, registra las acciones realizadas en el sistema, tales como
     * la creación, actualización o eliminación de registros en otros modelos
     * (como `User`, `Product`, `Sale`, etc.). También almacena los valores
     * antiguos y nuevos de los atributos afectados por la acción.
     * 
     * Atributos:
     * - `user_name`: Nombre del usuario que realiza la acción.
     * - `action`: Descripción de la acción realizada (por ejemplo, "Crear Usuario", "Eliminar Producto").
     * - `model`: Nombre del modelo afectado (por ejemplo, "User", "Product", "Sale").
     * - `old_values`: Valores anteriores antes de la acción (almacenados como JSON).
     * - `new_values`: Nuevos valores después de la acción (almacenados como JSON).
     * - `state`: Estado del log (por ejemplo, "inactive", "active", etc.).
     * - `created_at`: Fecha y hora en que se realizó la acción.
     * - `updated_at`: Fecha y hora de la última actualización del registro.
     * 
     * Este modelo es utilizado comúnmente para mantener un registro detallado
     * de todas las acciones importantes dentro del sistema, permitiendo
     * la trazabilidad de las modificaciones y proporcionando información útil
     * para auditorías de seguridad o análisis de cambios en los datos.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
