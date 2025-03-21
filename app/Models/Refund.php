<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    /**
     * Usamos el trait HasFactory para habilitar la creación de fábricas de modelos para pruebas.
     */
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'reason',     // Motivo del reembolso
        'client',     // Nombre del cliente
        'product',    // Producto relacionado con el reembolso
        'refund_date' // Fecha del reembolso
    ];

    /**
     * Descripción del Modelo `Refund`
     * 
     * Propósito: Este modelo representa un reembolso realizado por un cliente. Un reembolso
     * incluye información sobre el motivo de la devolución, el cliente, el producto afectado
     * y la fecha del reembolso. Este modelo permite llevar un registro detallado de las devoluciones
     * de productos realizadas por los clientes y su impacto en el inventario.
     * 
     * Atributos:
     * - `reason`: El motivo del reembolso solicitado por el cliente.
     * - `client`: El nombre del cliente que solicita el reembolso.
     * - `product`: El producto que está siendo devuelto.
     * - `refund_date`: La fecha en la que se realiza el reembolso.
     * 
     * Este modelo es clave para gestionar las devoluciones de productos y mantener un registro
     * de las transacciones de reembolso, lo que permite un control efectivo sobre el inventario
     * y las transacciones con los clientes.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
