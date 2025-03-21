<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración para crear la tabla `sale_product`.
     *
     * Esta migración crea la tabla `sale_product`, que es una tabla intermedia 
     * que relaciona las ventas con los productos, almacenando información sobre 
     * la cantidad y el precio de cada producto vendido en cada venta.
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('sale_product', function (Blueprint $table) {
            $table->id();  // ID único para la relación
            $table->foreignId('sale_id')->constrained()->onDelete('restrict');  // Relación con la tabla `sales`
            $table->foreignId('product_id')->constrained()->onDelete('restrict');  // Relación con la tabla `products`
            $table->integer('quantity');  // Cantidad de productos vendidos en la venta
            $table->integer('price');  // Precio del producto durante la venta
            $table->timestamps();  // Campos de marca de tiempo: created_at y updated_at
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `sale_product`.
     *
     * Esta función elimina la tabla `sale_product` de la base de datos.
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_product');  // Elimina la tabla 'sale_product' si existe
    }
};
