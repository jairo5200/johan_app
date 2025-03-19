import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Returns({ returns }: any) {
  return (
    <AppLayout
      title="Devoluciones"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Devoluciones
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Lista de Devoluciones
            </h1>
            <ul className="mt-4">
              {returns.map((ret: any) => (
                <li key={ret.id} className="p-2 border-b border-gray-300">
                  <strong>{ret.product_name}</strong> - Motivo: {ret.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
