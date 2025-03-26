import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/core';

interface Notification {
  id: number;
  action: string;           // "Venta Realizada"
  created_at: string;
  user_name?: string;
  new_values?: string;      // Cadena JSON con los detalles del producto
  // Puedes agregar otros campos si lo necesitas
}

interface NotificationsWidgetProps {
  notifications: Notification[];
}

const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({ notifications }) => {
  // Mantenemos dos listas: notificaciones no leídas y leídas.
  const [unread, setUnread] = useState<Notification[]>([]);
  const [read, setRead] = useState<Notification[]>([]);
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    console.log("Notificaciones recibidas:", notifications);
    setUnread(notifications);
    setRead([]);
  }, [notifications]);

  const markAsRead = (id: number) => {
    setUnread(prevUnread => {
      const updatedUnread = prevUnread.filter(noti => noti.id !== id);
      const marked = prevUnread.find(noti => noti.id === id);
      if (marked) {
        setRead(prevRead => {
          const newRead = [marked, ...prevRead];
          return newRead.slice(0, 10); // conserva solo las 10 más recientes
        });

        // Enviar la actualización al backend para marcar como leído
        router.put(
          `/logs/${id}`,
          { state: 'inactive' },
          {
            preserveState: false,
            onSuccess: () => {
              console.log(`Notificación ${id} marcada como leída.`);
            },
            onError: (errors) => {
              console.error('Error al marcar la notificación como leída', errors);
            }
          }
        );
      }
      return updatedUnread;
    });
  };

  // Si no hay notificaciones, mostrar un mensaje
  if (!unread.length && !read.length) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        No hay notificaciones nuevas.
      </div>
    );
  }

  // Función para extraer información del producto desde new_values
  const getProductInfo = (noti: Notification): string | null => {
    if (noti.new_values) {
      try {
        const values = JSON.parse(noti.new_values);
        if (Array.isArray(values) && values.length > 0) {
          return values[0].product_name || null;
        }
      } catch (e) {
        console.error("Error parseando new_values", e);
      }
    }
    return null;
  };

  return (
    <>
      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
        Notificaciones Activas
      </h3>
      {unread.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {unread.map((noti) => {
            const productInfo = getProductInfo(noti);
            return (
              <li key={noti.id} className="py-2 flex justify-between items-start">
                <div>
                  {/* Muestra la acción, que es "Venta Realizada" */}
                  <p className="text-gray-800 dark:text-gray-300">{noti.action}</p>
                  {productInfo && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Producto: {productInfo}
                    </p>
                  )}
                  {noti.user_name && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Por: {noti.user_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(noti.created_at).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => markAsRead(noti.id)} 
                  className="ml-2 text-xs text-blue-500 hover:underline"
                >
                  Marcar como leído
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No hay notificaciones nuevas.
        </p>
      )}
      {read.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowRead(prev => !prev)}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
          >
            {showRead ? "Ocultar leídas" : `Mostrar leídas (${read.length})`}
          </button>
          {showRead && (
            <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
              {read.map((noti) => {
                const productInfo = getProductInfo(noti);
                return (
                  <li key={noti.id} className="py-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{noti.action}</p>
                    {productInfo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Producto: {productInfo}
                      </p>
                    )}
                    {noti.user_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Por: {noti.user_name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(noti.created_at).toLocaleString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationsWidget;







