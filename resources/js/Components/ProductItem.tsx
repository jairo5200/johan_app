import React, { useState } from "react";
import { createPortal } from "react-dom";
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface ProductItemProps {
  product: any;
  handleDeleteProduct: (product: any) => void;
  handleEditProduct: (product: any) => void;
  isPrivileged: boolean;
}

export default function ProductItem({
  product,
  handleDeleteProduct,
  handleEditProduct,
  isPrivileged
}: ProductItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="text-center text-white bg-gray-800 border-gray-300">
        <td className="px-4 py-2 border-b border-r border-gray-300">
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
          {isPrivileged ? (
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
          ) : (
            <div className="flex justify-center text-gray-400">
              <LockClosedIcon className="h-5 w-5" title="Sin permisos" />
            </div>
          )}
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
