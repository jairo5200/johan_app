import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/core';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  user_name?: string;
  product?: string; // si se envía esta info
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
          return newRead.slice(0, 10); // mantiene solo las 10 más recientes
        });

        // Enviar la actualización al backend (cambiando el estado a inactivo)
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

  if (!unread.length && !read.length) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        No hay notificaciones nuevas.
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
        Notificaciones Activas
      </h3>
      {unread.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {unread.map((noti) => (
            <li key={noti.id} className="py-2 flex justify-between items-start">
              <div>
                <p className="text-gray-800 dark:text-gray-300">{noti.message}</p>
                {noti.product && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Producto: {noti.product}
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
          ))}
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
              {read.map((noti) => (
                <li key={noti.id} className="py-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{noti.message}</p>
                  {noti.product && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Producto: {noti.product}
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
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationsWidget;






