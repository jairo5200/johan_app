<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
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
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
