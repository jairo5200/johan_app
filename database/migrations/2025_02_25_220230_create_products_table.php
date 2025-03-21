<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración para crear la tabla `products`.
     *
     * Esta migración crea la tabla `products` en la base de datos, que almacenará
     * los detalles de los productos disponibles en el sistema. Los campos incluyen
     * el nombre del producto, descripción, precio, imagen, stock y estado.
     * El estado se establece por defecto como 'active'.
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();  // ID único para cada producto
            $table->string('name');  // Nombre del producto
            $table->string('description');  // Descripción del producto
            $table->integer('price');  // Precio del producto en entero (puede ser modificado si es necesario)
            $table->string('image');  // Ruta de la imagen del producto
            $table->integer('stock');  // Cantidad disponible en stock
            $table->string('state')->default('active');  // Estado del producto, se establece 'active' por defecto
            $table->timestamps();  // Campos de marca de tiempo: created_at y updated_at
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `products`.
     *
     * Esta función elimina la tabla `products` de la base de datos. 
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');  // Elimina la tabla 'products' si existe
    }
};
