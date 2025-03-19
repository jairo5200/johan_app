import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function logs({ logs }: any) {
  // Estado para el término de búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('hoy');

  // Filtrado de devoluciones según fecha, usuario, producto o motivo
  const filteredlogs = useMemo(() => {
    if (!logs || !Array.isArray(logs)) return [];
    
    return logs.filter((log: any) => {
      // Verificamos que exista la fecha
      if (!log.date) return false;
      
      // Filtrar por fecha: hoy, mensual o anual.
      const today = new Date().toISOString().split('T')[0];
      if (filter === 'hoy' && !log.date.startsWith(today)) return false;
      
      const retDate = new Date(log.date);
      if (filter === 'mensual' && retDate.getMonth() !== new Date().getMonth()) return false;
      if (filter === 'anual' && retDate.getFullYear() !== new Date().getFullYear()) return false;
      
      // Filtro de búsqueda: puede buscar en usuario, producto o motivo.
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          log.user?.name.toLowerCase().includes(term) ||
          log.product?.name.toLowerCase().includes(term) ||
          log.reason.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [logs, filter, searchTerm]);

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
            {/* Filtros de búsqueda y filtro desplegable */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="p-2 border rounded-lg bg-gray-800 text-white" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="p-2 border rounded-lg bg-gray-800 text-white" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="hoy">Hoy</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>

            {/* Tabla de devoluciones */}
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className="overflow-hidden">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border-r border-b border-gray-300">Fecha</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Cambio</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">ubicación</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">antiguos valores</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">nuevos valores</th>
                    </tr>
                  </thead>
                  {logs.length > 0 ? (
                    <tbody>
                      {logs.map((log: any) => (
                        <tr key={log.id} className="border-b border-gray-300 text-white">
                          <td className="px-4 py-2 border-r">{log.created_at}</td>
                          <td className="px-4 py-2 border-r">{log.user_name}</td>
                          <td className="px-4 py-2 border-r">{log.action}</td>
                          <td className="px-4 py-2 border-r">{log.model}</td>
                          <td className="px-4 py-2 border-r">{log.old_values}</td>
                          <td className="px-4 py-2 border-r">{log.new_values}</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No se encontraron devoluciones.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );}