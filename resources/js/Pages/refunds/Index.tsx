import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import 'animate.css';

export default function Refunds({ refunds, notificacionesActivas }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('hoy');

  // Estados para la paginación
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Obtener la fecha actual
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // Filtrar devoluciones según fecha, usuario, producto o motivo
  const filteredRefunds = useMemo(() => {
    if (!refunds || !Array.isArray(refunds)) return [];

    return refunds.filter((refund: any) => {
      if (!refund.refund_date) return false; // Asegurar que tenga fecha

      // Conversión de fecha para comparación
      const refundDate = new Date(refund.refund_date);
      const isToday = refund.refund_date.startsWith(todayISO);
      const isMonthly = refundDate.getMonth() === today.getMonth() && refundDate.getFullYear() === today.getFullYear();
      const isYearly = refundDate.getFullYear() === today.getFullYear();

      // Aplicar filtro de fecha
      if (filter === 'hoy' && !isToday) return false;
      if (filter === 'mensual' && !isMonthly) return false;
      if (filter === 'anual' && !isYearly) return false;

      // Filtro de búsqueda
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          refund.client?.toLowerCase().includes(term) ||
          refund.product?.toLowerCase().includes(term) ||
          refund.reason?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [refunds, filter, searchTerm, todayISO]);

  // Calcular el total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredRefunds.length / itemsPerPage);
  }, [filteredRefunds, itemsPerPage]);

  // Obtener los datos paginados para la página actual
  const paginatedRefunds = useMemo(() => {
    return [...filteredRefunds].reverse().slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredRefunds, page, itemsPerPage]);

  return (
    <AppLayout
      title="Devoluciones"
      renderHeader={() => (
        <h2 className="font-semibold text-xl  leading-tight text-amber-100 animate__animated animate__slideInRight">
          Devoluciones
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="dark:bg-gray-800/50 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
            
            {/* Filtros de búsqueda y fecha */}
            <div className="overflow-x-auto flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Buscar por usuario, producto o motivo..."
                  className="p-2 border rounded-lg bg-gray-800 text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reinicia la página al cambiar la búsqueda
                  }}
                />
                <select
                  className="p-2 border rounded-lg bg-gray-800 text-white"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1); // Reinicia la página al cambiar el filtro
                  }}
                >
                  <option value="hoy">Hoy</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>

            {/* Tabla de devoluciones */}
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className="">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border-r border-b border-gray-300">Fecha</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Producto</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRefunds.length > 0 ? (
                      paginatedRefunds.map((refund: any) => (
                        <tr key={refund.id} className="border-b border-gray-300 text-white">
                          <td className="px-4 py-2 border-r">{refund.refund_date}</td>
                          <td className="px-4 py-2 border-r">{refund.client}</td>
                          <td className="px-4 py-2 border-r">{refund.product}</td>
                          <td className="px-4 py-2 border-r">{refund.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-white">
                          No se encontraron devoluciones.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
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
                    className={`px-4 py-2 rounded-md ${page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
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
            )}

          </div>
        </div>
      </div>
    </AppLayout>
  );
}







