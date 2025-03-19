<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;

    // Especificar los campos que se pueden asignar masivamente
    protected $fillable = [
        'reason',     // Motivo del reembolso
        'client',     // Nombre del cliente
        'product',    // Producto relacionado con el reembolso
        'refund_date' // Fecha del reembolso
    ];
}
