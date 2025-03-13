import React from "react";

const ProductCard = ({ product}:any) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
      {/* Título con el nombre del producto */}
      <div className="text-xl font-semibold mb-2">
        {product.name}
      </div>
      {/* Número de stock */}
      <div className="text-3xl font-bold text-green-500">
        {product.stock}
      </div>
    </div>
  );
};

export default ProductCard;