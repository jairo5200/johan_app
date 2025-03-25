import React, { useState } from 'react';
import NotificationsWidget from './NotificationsWidget'; // tu componente actual de notificaciones

interface Notification {
  id: number;
  message: string;
  created_at: string;
  user_name?: string;
}

interface NotificationBellProps {
  notifications: Notification[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Contamos cuántas notificaciones (no leídas, etc.)
  const unreadCount = notifications.length;

  return (
    <div className="relative inline-block text-left">
      {/* Ícono de la campana */}
      <button
        onClick={toggleNotifications}
        className="
          relative
          inline-flex
          items-center
          justify-center
          text-gray-700
          dark:text-gray-400
          hover:text-yellow-400
          dark:hover:text-yellow-300
          focus:outline-none
          focus:ring-0
          focus:border-0
          active:outline-none
          active:ring-0
          active:border-0
          hover:bg-transparent
          active:bg-transparent
          focus:bg-transparent
          px-0
          py-0
          rounded-full
          transition-colors
        "
        style={{ background: 'transparent' }} // Asegura fondo transparente
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405C18.21 14.79 18 14.21 18 13.59V11a6 6 0
            00-4.5-5.8V4a1.5 1.5 0 00-3 0v1.2A6 6 0 006 11v2.59c0
            .62-.21 1.2-.595 1.605L4 17h11z"
          />
        </svg>
        {/* Circulito de conteo de notificaciones */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              top-0
              right-0
              inline-flex
              items-center
              justify-center
              px-2
              py-1
              text-xs
              font-bold
              leading-none
              text-red-100
              bg-red-600
              rounded-full
              transform
              translate-x-2
              -translate-y-2
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel desplegable de notificaciones */}
      {showNotifications && (
        <div
          className="
            origin-top-right
            absolute
            right-0
            mt-2
            w-80
            bg-white
            dark:bg-gray-800
            p-4
            rounded
            shadow-lg
            z-50
          "
        >
          <NotificationsWidget notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;


