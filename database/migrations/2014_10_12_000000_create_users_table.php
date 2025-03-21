<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones para crear la tabla `users`.
     *
     * Esta migración crea la tabla `users` en la base de datos, que almacenará los
     * datos de los usuarios del sistema. Los campos incluyen la información básica
     * como nombre, correo electrónico, contraseña, rol, estado y otros detalles.
     * También incluye un campo para el perfil del usuario y la relación con el equipo
     * actual del usuario (si corresponde).
     *
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();  // ID único para cada usuario
            $table->string('name');  // Nombre del usuario
            $table->string('email')->unique();  // Correo electrónico único para cada usuario
            $table->timestamp('email_verified_at')->nullable();  // Fecha de verificación del correo electrónico (puede ser nula)
            $table->string('password');  // Contraseña del usuario
            $table->rememberToken();  // Token para recordar al usuario (utilizado en la funcionalidad de "Recordarme")
            $table->string('role');  // Rol del usuario (ej. admin, usuario)
            $table->string('state')->default('active');  // Estado del usuario, se establece 'active' por defecto
            $table->foreignId('current_team_id')->nullable();  // ID del equipo actual del usuario (puede ser nulo)
            $table->string('profile_photo_path', 2048)->nullable();  // Ruta de la foto de perfil del usuario (puede ser nula)
            $table->timestamps();  // Campos de marca de tiempo: created_at y updated_at
        });
    }

    /**
     * Reversa la migración, eliminando la tabla `users`.
     *
     * Esta función elimina la tabla `users` de la base de datos. 
     * Es útil para revertir la migración si es necesario.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');  // Elimina la tabla 'users' si existe
    }
};
