<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
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
        'sale_date', // la fecha que se realiza la venta
        'user_id',  // El ID del usuario que realiza la venta
        'total',    // El total de la venta
    ];

    /**
     * Relación con el usuario que realizó la venta.
     * 
     * Una venta pertenece a un único usuario, quien es el responsable de la transacción.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con los productos vendidos a través de SaleProduct.
     * 
     * Una venta tiene muchos productos a través de la tabla SaleProduct, que
     * contiene detalles adicionales como la cantidad y el precio de cada producto
     * vendido en esa transacción.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);  // Una venta tiene muchos SaleProducts
    }

    /**
     * Relación con los productos a través de la tabla sale_product.
     * 
     * Una venta puede tener muchos productos y estos productos se gestionan
     * mediante una tabla intermedia `sale_product` que también almacena
     * información adicional como la cantidad y el precio de cada producto
     * en la venta.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'sale_product')
                    ->withPivot('quantity', 'price')  // Los datos adicionales de la tabla intermedia
                    ->withTimestamps();
    }

    /**
     * Descripción del Modelo `Sale`
     * 
     * Propósito: Este modelo representa una venta realizada en el sistema. Una venta incluye información
     * sobre la fecha de la transacción, el usuario que la realizó, el total de la venta, y los productos
     * asociados a la venta. Este modelo es esencial para llevar un registro detallado de todas las ventas
     * realizadas, permitiendo consultar, actualizar y auditar las transacciones realizadas en el sistema.
     * 
     * Atributos:
     * - `sale_date`: La fecha en que se realiza la venta.
     * - `user_id`: El ID del usuario que realizó la venta.
     * - `total`: El monto total de la venta.
     * 
     * Relaciones:
     * - `user()`: Relación con el usuario que realizó la venta.
     * - `saleProducts()`: Relación con los productos vendidos a través de SaleProduct.
     * - `products()`: Relación con los productos vendidos a través de la tabla intermedia `sale_product`.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
