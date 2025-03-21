<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
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
        'name',        // Nombre del producto
        'description', // Descripción del producto
        'price',       // Precio del producto
        'image',       // Imagen del producto
        'stock',       // Cantidad de unidades disponibles en inventario
        'state',       // Estado del producto (por ejemplo, 'activo' o 'inactivo')
    ];

    /**
     * Relación de muchos a muchos con el modelo Sale.
     * Un producto puede ser parte de muchas ventas.
     * La tabla intermedia 'sale_product' contiene la cantidad y el precio del producto en cada venta.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function sales()
    {
        return $this->belongsToMany(Sale::class, 'sale_product')
                    ->withPivot('quantity', 'price')  // Los datos adicionales de la tabla intermedia
                    ->withTimestamps();              // Para mantener las marcas de tiempo en la tabla intermedia
    }

    /**
     * Descripción del Modelo `Product`
     * 
     * Propósito: Este modelo representa un producto en el sistema. Un producto tiene
     * atributos como su nombre, descripción, precio, imagen, cantidad en stock y estado.
     * Los productos están asociados con ventas a través de una relación de muchos a muchos
     * con el modelo `Sale`, lo que permite registrar las ventas de productos específicos
     * junto con su cantidad y precio en cada venta.
     * 
     * Atributos:
     * - `name`: El nombre del producto.
     * - `description`: Una descripción detallada del producto.
     * - `price`: El precio del producto.
     * - `image`: La ruta o URL de la imagen del producto.
     * - `stock`: La cantidad disponible en inventario.
     * - `state`: El estado del producto (por ejemplo, 'activo' o 'inactivo').
     * 
     * Relaciones:
     * - `sales`: Relación de muchos a muchos con el modelo `Sale`. Un producto puede estar presente en muchas ventas.
     * 
     * Este modelo es fundamental para la gestión de productos en el sistema, permitiendo
     * la venta de productos, el control del stock, y el seguimiento de la información
     * relacionada con cada producto vendido.
     * 
     * Autor: Jairo Bastidas
     * Fecha de creación: 2025-03-21
     */
}
