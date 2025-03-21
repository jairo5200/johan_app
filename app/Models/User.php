<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /**
     * Usamos los traits necesarios para habilitar funcionalidades adicionales
     * como el manejo de tokens de API, la autenticación de dos factores,
     * las fotos de perfil y las notificaciones.
     */
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',    // Nombre del usuario
        'email',   // Correo electrónico del usuario
        'password',// Contraseña del usuario
        'role',    // Rol del usuario (por ejemplo: admin, usuario)
        'state',   // Estado del usuario (activo, inactivo)
    ];

    /**
     * Los atributos que deberían ser ocultados para la serialización.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',               // Contraseña del usuario, debe estar oculta
        'remember_token',         // Token para recordar al usuario
        'two_factor_recovery_codes', // Códigos de recuperación para 2FA
        'two_factor_secret',      // Secreto de autenticación de dos factores
    ];

    /**
     * Los atributos que deberían ser convertidos a un tipo específico.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime', // Convertir la fecha de verificación del email a tipo datetime
    ];

    /**
     * Los accesores que se añadirán al modelo cuando se convierta en un arreglo.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url', // Añadir la URL de la foto de perfil
    ];

    /**
     * Descripción del Modelo `User`
     * 
     * Propósito: Este modelo representa al usuario dentro del sistema. 
     * Contiene los atributos básicos de autenticación y autorización del usuario,
     * como su nombre, correo electrónico, rol y estado.
     * 
     * Atributos:
     * - `name`: Nombre del usuario.
     * - `email`: Correo electrónico del usuario.
     * - `password`: Contraseña para la autenticación del usuario.
     * - `role`: Rol del usuario (por ejemplo: administrador, usuario regular).
     * - `state`: Estado del usuario (activo/inactivo).
     * 
     * Relaciones:
     * - Este modelo puede tener relaciones con otros modelos, como `Sale`, `Product`, etc., a través de relaciones Eloquent.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
