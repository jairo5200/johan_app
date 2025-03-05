import React from "react";

export default function ProductItem({
    product
  }: any) {
    return (
        <tr  className="text-center text-white bg-gray-800 border-b border-gray-300">
            <td className="px-4 py-2 border-r border-gray-300"><img src={product.image} alt="" className="w-[100px]" /></td>
            <td className="px-4 py-2 border-r border-gray-300">{product.name}</td>
            <td className="px-4 py-2 border-r border-gray-300">{product.description}</td>
            <td className="px-4 py-2 border-r border-gray-300">{product.price}</td>
            <td className="px-4 py-2 border-r border-gray-300">{product.stock}</td>
        </tr>
      
    );
  }


