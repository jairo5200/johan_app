<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class SaleProduct extends Model
{
    use HasFactory;

    // Definir los campos que pueden ser asignados de manera masiva
    protected $fillable = [
        'sale_id',  // ID de la venta
        'product_id',  // ID del producto
        'quantity',  // Cantidad de productos
        'price',  // Precio del producto
    ];

    // Relación con la venta (Sale)
    public function sale()
    {
        return $this->belongsTo(Sale::class);  // Un SaleProduct pertenece a una Sale
    }

    // Relación con el producto (Product)
    public function product()
    {
        return $this->belongsTo(Product::class);  // Un SaleProduct pertenece a un Product
    }
}
