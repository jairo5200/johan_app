import React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function ProductItem({ product, handleDeleteProduct, handleEditProduct }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="text-center text-white bg-gray-800/60 border-gray-300">
        <td className="px-4 py-2 border-b border-r border-gray-300 ">
          <img
            src={`/img/${product.image}`}
            alt={product.name}
            className="w-[3rem] h-[3rem] cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </td>
        <td className="px-4 py-2 border-b border-r border-gray-300">{product.name}</td>
        <td className="px-4 py-2 w-[600px] border-b border-r border-gray-300">{product.description}</td>
        <td className="px-4 py-2 border-b border-r border-gray-300 text-center">{product.price}</td>
        <td className="px-4 py-2 border-b border-r border-gray-300 text-center">{product.stock}</td>
        <td className="px-4 py-2 border-b border-gray-300">
          <div className="flex justify-center space-x-2">
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              onClick={() => handleEditProduct(product)}
            >
              Editar
            </button>
            <button 
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" 
              onClick={() => handleDeleteProduct(product)}
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={() => setIsOpen(false)}
          >
            <img
              src={`/img/${product.image}`}
              alt={product.name}
              className="max-w-full max-h-full"
            />
          </div>,
          document.body
        )}
    </>
  );
}
