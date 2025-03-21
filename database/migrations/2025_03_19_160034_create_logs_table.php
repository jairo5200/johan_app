<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración para crear la tabla `logs`.
     *
     * Esta migración crea la tabla `logs`, que almacena los registros de auditoría de las transacciones
     * realizadas en el sistema, como la creación, actualización o eliminación de registros.
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id(); // ID único para cada registro de log
            $table->string('user_name'); // Nombre del usuario que realizó la transacción
            $table->string('action'); // Acción realizada (crear, actualizar, eliminar)
            $table->string('model'); // Nombre del modelo (Product, User, etc.)
            $table->text('old_values')->nullable(); // Valores antiguos (antes de la acción)
            $table->text('new_values')->nullable(); // Valores nuevos (después de la acción)
            $table->timestamp('created_at')->useCurrent(); // Fecha y hora de la transacción
            $table->timestamp('updated_at')->useCurrent(); // Fecha y hora de la transacción
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `logs`.
     *
     * Esta función elimina la tabla `logs` de la base de datos.
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');  // Elimina la tabla 'logs' si existe
    }
};
