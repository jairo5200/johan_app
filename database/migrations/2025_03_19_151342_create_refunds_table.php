<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración para crear la tabla `refunds`.
     *
     * Esta migración crea la tabla `refunds`, que almacena la información de los reembolsos 
     * solicitados, incluyendo el motivo, el cliente, el producto relacionado y la fecha del reembolso.
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id(); // ID único para cada reembolso
            $table->string('reason');  // Motivo del reembolso
            $table->string('client');  // Nombre del cliente
            $table->string('product'); // Producto relacionado con el reembolso
            $table->date('refund_date'); // Fecha del reembolso
            $table->timestamps(); // Fecha de creación y actualización
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `refunds`.
     *
     * Esta función elimina la tabla `refunds` de la base de datos.
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');  // Elimina la tabla 'refunds' si existe
    }
};
