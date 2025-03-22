<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessAttempt extends Model
{
    use HasFactory;

    // Definir la tabla (opcional, Laravel usa pluralización por defecto)
    protected $table = 'access_attempts';

    // Los campos que pueden ser asignados masivamente
    protected $fillable = ['user_id', 'route'];

    // Relación con el modelo User (un intento de acceso pertenece a un usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
