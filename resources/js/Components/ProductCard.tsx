import React from "react";

const ProductCard = ({ product}:any) => {
  return (
    <div className=" pl-3 flex flex-col border-l-4">
      {/* Título con el nombre del producto */}
      <div className="text-xl font-semibold ">
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