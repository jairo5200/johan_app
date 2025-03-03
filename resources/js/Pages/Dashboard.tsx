import React from 'react';
import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState } from "react";

// export default function Dashboard() {
//   return (
//     <AppLayout
//       title="Dashboard"
      
//     >
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="my-2 bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
//             asdas
//           </div>
//           <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
//             producto
//             d
//             s
//             s
//             s
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 13; // Cambia según la cantidad de elementos por página

  // Simulación de productos u otros datos a paginar
  const items = [
    { id: 1, content: "Producto 1" },
    { id: 2, content: "Producto 2" },
    { id: 3, content: "Producto 3" },
    { id: 4, content: "Producto 4" },
    { id: 5, content: "Producto 4" },
    { id: 6, content: "Producto 4" },
    { id: 7, content: "Producto 4" },
    { id: 8, content: "Producto 4" },
    { id: 9, content: "Producto 4" },
    { id: 10, content: "Producto 4" },
    { id: 11, content: "Producto 4" },
    { id: 12, content: "Producto 4" },
    { id: 13, content: "Producto 4" },
  ];

  // Calcular los elementos a mostrar según la página
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AppLayout title="Dashboard">
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="my-2 bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-4"
            >
              {item.content}
            </div>
          ))}

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
