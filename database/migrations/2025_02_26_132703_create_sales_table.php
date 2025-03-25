<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración para crear la tabla `sales`.
     *
     * Esta migración crea la tabla `sales` en la base de datos, que almacenará
     * los detalles de las ventas realizadas, incluyendo la fecha de la venta, 
     * el total de la venta y la relación con el usuario que realizó la venta.
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();  // ID único para cada venta
            $table->Date('sale_date');  // Fecha en la que se realizó la venta
            $table->integer('total');  // Total de la venta
            $table->foreignId('user_id')->constrained()->onDelete('restrict');  // Relación con el usuario (usuario que realizó la venta)
            $table->string('state')->default('active');  // Estado de la venta
            $table->timestamps();  // Campos de marca de tiempo: created_at y updated_at
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `sales`.
     *
     * Esta función elimina la tabla `sales` de la base de datos. 
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');  // Elimina la tabla 'sales' si existe
    }
};
