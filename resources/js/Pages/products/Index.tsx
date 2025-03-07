import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState } from "react";
import ProductItem from '@/Components/ProductItem';

export default function Products({products}: any) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 1; // Cambia según la cantidad de elementos por página

  // Calcular los elementos a mostrar según la página
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleItems = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AppLayout 
     title="Products" renderHeader={() => (
     <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
     Productos
     </h2>
     )}>
      <div className="py-12"></div>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
          <div className='bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6'>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Productos</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" /*onClick={handleAddUser}*/>
                Agregar Producto
              </button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className='overflow-hidden'>
                <table className="w-full table-auto overflow-hidden border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-4 py-2 w-[70px] border-r border-b border-gray-300">Image</th>
                      <th className="px-4 py-2 w-[200px] border-r border-b border-gray-300">Name</th>
                      <th className="px-4 py-2 w-[500px] border-r border-b border-gray-300">Description</th>
                      <th className="px-4 py-2 w-[70px] text-center border-r border-b border-gray-300">Price</th>
                      <th className="px-2 py-2 w-[60px] text-center border-b border-gray-300">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((product: any) => (
                      <ProductItem key={product.id} product={product} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          {/* Paginación */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              « Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  page === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}