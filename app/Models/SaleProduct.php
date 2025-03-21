<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleProduct extends Model
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
        'sale_id',  // ID de la venta
        'product_id',  // ID del producto
        'quantity',  // Cantidad de productos
        'price',  // Precio del producto
    ];

    /**
     * Relación con la venta (Sale).
     * 
     * Un `SaleProduct` pertenece a una única `Sale`, ya que cada registro en
     * la tabla `sale_product` está asociado a una venta específica.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sale()
    {
        return $this->belongsTo(Sale::class);  // Un SaleProduct pertenece a una Sale
    }

    /**
     * Relación con el producto (Product).
     * 
     * Un `SaleProduct` pertenece a un único `Product`, ya que cada registro
     * en la tabla `sale_product` está asociado a un producto específico.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);  // Un SaleProduct pertenece a un Product
    }

    /**
     * Descripción del Modelo `SaleProduct`
     * 
     * Propósito: Este modelo representa la relación entre una venta y los productos
     * asociados a ella. La tabla `sale_product` contiene información adicional
     * como la cantidad de productos vendidos y su precio, permitiendo así llevar
     * un registro detallado de los productos involucrados en cada transacción.
     * 
     * Atributos:
     * - `sale_id`: El ID de la venta a la que pertenece el producto.
     * - `product_id`: El ID del producto vendido.
     * - `quantity`: La cantidad de unidades del producto vendido.
     * - `price`: El precio del producto en esa transacción.
     * 
     * Relaciones:
     * - `sale()`: Relación con la venta a la que pertenece el producto.
     * - `product()`: Relación con el producto vendido en la transacción.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
