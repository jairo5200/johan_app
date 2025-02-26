<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',  // El ID del usuario que realiza la venta
        'total',    // El total de la venta
    ];
     // Relación con el usuario
     public function user()
     {
         return $this->belongsTo(User::class);
     }

    // Relación con los productos a través de SaleProduct
    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);  // Una venta tiene muchos SaleProducts
    }

    // Relación con los productos a través de SaleProduct
    public function products()
    {
        return $this->belongsToMany(Product::class, 'sale_product')
                    ->withPivot('quantity', 'price')  // Los datos adicionales de la tabla intermedia
                    ->withTimestamps();
    }
}
