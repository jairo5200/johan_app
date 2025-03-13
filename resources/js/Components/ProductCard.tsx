import React from "react";

const ProductCard = ({ product}:any) => {
  return (
    <div className=" pl-3 flex flex-col border-l-4 border-amber-100">
      {/* Título con el nombre del producto */}
      <div className="font-semibold  text-gray-800 dark:text-gray-400 leading-tight">
        {product.name}
      </div>
      {/* Número de stock */}
      <div className=" font-bold text-lg text-orange-300">
        {product.stock}
      </div>
    </div>
  );
};

export default ProductCard;