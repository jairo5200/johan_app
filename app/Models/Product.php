<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'stock',
        'state',
    ];

    public function sales()
    {
        return $this->belongsToMany(Sale::class, 'sale_product')
                    ->withPivot('quantity', 'price')  // Los datos adicionales de la tabla intermedia
                    ->withTimestamps();
    }
}
