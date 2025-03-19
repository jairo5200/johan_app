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
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
        $table->string('user_name'); // Nombre del usuario que realizó la transacción
        $table->string('action'); // Acción realizada (crear, actualizar, eliminar)
        $table->string('model'); // Nombre del modelo (Product)
        $table->text('old_values')->nullable(); // Valores antiguos (antes de la acción)
        $table->text('new_values')->nullable(); // Valores nuevos (después de la acción)
        $table->timestamp('created_at')->useCurrent(); // Fecha y hora de la transacción
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
