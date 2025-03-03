import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Products({products}) {
  return (
    <AppLayout
      title="Productos"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Productos
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Lista de productos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
            {products.map((product: any) => (
          <div>
            <li key={product.id}>{product.name}</li>
            <li key={product.id}>{product.description}</li>
            <img src={product.image} alt="golulu" />
          </div>

        ))}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

