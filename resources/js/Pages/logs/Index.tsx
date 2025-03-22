import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Logs({ logs }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('hoy');

  // Función para formatear fecha a "DD/MM/YYYY HH:MM:SS"
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para formatear los valores antiguos y nuevos según la acción
  const formatJson = (jsonString: string, action: string, model?: string) => {
    try {
      if (!jsonString) return 'Sin datos';
      const parsed = JSON.parse(jsonString);
      const lowerAction = action.toLowerCase();
      const lowerModel = model ? model.toLowerCase() : '';

      // Caso: Venta Realizada (se espera un array de objetos)
      if (lowerAction === 'venta realizada') {
        if (!Array.isArray(parsed))
          return 'Formato inesperado';
        return (
          <ul>
            {parsed.map((item: any, index: number) => (
              <li key={index}>
                {item.product_name} (ID: {item.product_id}) - Stock: {item.old_stock} → {item.new_stock}
                {item.quantity_sold ? ` (Vendidos: ${item.quantity_sold})` : ''} - Precio: {item.price}
              </li>
            ))}
          </ul>
        );
      }
      // Caso: Acciones relacionadas con Producto (Crear/Eliminar Producto)
      else if (lowerAction.includes('producto')) {
        if (typeof parsed !== 'object' || Array.isArray(parsed))
          return 'Formato inesperado';
        return (
          <ul>
            {Object.entries(parsed).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        );
      }
      // Caso: Acciones relacionadas con Usuario (Crear Usuario, Desactivar Usuario, etc.)
      else if (lowerAction.includes('usuario')) {
        if (typeof parsed !== 'object' || Array.isArray(parsed))
          return 'Formato inesperado';
        return (
          <ul>
            {Object.entries(parsed).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        );
      }
      // Caso: Acciones relacionadas con Reembolso (Registrar Reembolso)
      else if (lowerAction.includes('reembolso') || lowerModel === 'refund') {
        if (typeof parsed !== 'object' || Array.isArray(parsed))
          return 'Formato inesperado';
        return (
          <ul>
            {Object.entries(parsed).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        );
      }
      return 'Datos no reconocidos';
    } catch {
      return 'Error al formatear datos';
    }
  };

  // Filtrado de logs según fecha, búsqueda y filtro
  const filteredLogs = useMemo(() => {
    if (!logs || !Array.isArray(logs)) return [];
    return logs.filter((log: any) => {
      if (!log.created_at) return false;
      const today = new Date().toISOString().split('T')[0];
      const logDate = new Date(log.created_at).toISOString().split('T')[0];
      if (filter === 'hoy' && logDate !== today) return false;
      if (filter === 'mensual' && new Date(log.created_at).getMonth() !== new Date().getMonth()) return false;
      if (filter === 'anual' && new Date(log.created_at).getFullYear() !== new Date().getFullYear()) return false;
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          log.user_name?.toLowerCase().includes(term) ||
          log.model?.toLowerCase().includes(term) ||
          log.action?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [logs, filter, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage]);
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);


  return (
    <AppLayout
      title="Transacciones"
      renderHeader={() => (
        <h2 className="font-semibold text-xl leading-tight text-amber-100 animate__animated animate__slideInRight">
          Transacciones
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-gray-600 dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
            {/* Filtros */}
            <div className="overflow-x-auto flex justify-between items-center mb-4">
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
            


            {/* Tabla de transacciones */}
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className="">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border-r border-b border-gray-300">Fecha</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Cambio</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Modelo</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Valores antiguos</th>
                      <th className="px-4 py-2 border-b border-gray-300">Valores nuevos</th>
                    </tr>
                  </thead>
                  {paginatedLogs.length > 0 ? (
                  <tbody>
                    {paginatedLogs.map((log: any) => (
                      <tr key={log.id} className="border-b border-gray-300 text-white">
                        <td className="px-4 py-2 border-r">{formatDate(log.created_at)}</td>
                        <td className="px-4 py-2 border-r">{log.user_name}</td>
                        <td className="px-4 py-2 border-r">{log.action}</td>
                        <td className="px-4 py-2 border-r">{log.model}</td>
                        <td className="px-4 py-2 border-r">{formatJson(log.old_values, log.action, log.model)}</td>
                        <td className="px-4 py-2 border-r">{formatJson(log.new_values, log.action, log.model)}</td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No se encontraron transacciones.
                      </td>
                    </tr>
                  </tbody>
                )}

                </table>
              </div>
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  « Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
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



