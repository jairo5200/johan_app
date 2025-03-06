import React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function ProductItem({ product }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="text-center text-white bg-gray-800 border-b border-gray-300">
        <td className="px-4 py-2 border-r border-gray-300">
          <img
            src={`/img/${product.image}`}
            alt={product.name}
            className="w-[3rem] h-[3rem] cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </td>
        <td className="px-4 py-2 border-r border-gray-300">{product.name}</td>
        <td className="px-4 py-2 border-r border-gray-300">{product.description}</td>
        <td className="px-4 py-2 border-r border-gray-300">{product.price}</td>
        <td className="px-4 py-2 border-r border-gray-300">{product.stock}</td>
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