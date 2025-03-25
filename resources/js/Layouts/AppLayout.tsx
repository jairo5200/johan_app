import { router } from '@inertiajs/core';
import { Link, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React, { PropsWithChildren, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ApplicationMark from '@/Components/ApplicationMark';
import Banner from '@/Components/Banner';
import Dropdown from '@/Components/Dropdown';
import DropdownLink from '@/Components/DropdownLink';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Team } from '@/types';
import ThemeToggle from '@/Components/ThemeToggle';
import { usePage } from '@inertiajs/react';
import AnimatedBackground from '@/Components/AnimatedBackground';
import NotificationsWidget from '@/Components/NotificationsWidget';
import NotificationBell from '@/Components/NotificationBell';

// Si tienes una definición centralizada de Notification, mejor definirla en un archivo de tipos
export interface Notification {
  id: number;
  message: string;
  created_at: string;
  user_name?: string;
}

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

export default function AppLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const page = useTypedPage();
  const route = useRoute();
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  function switchToTeam(e: React.FormEvent, team: Team) {
    e.preventDefault();
    router.put(
      route('current-team.update'),
      { team_id: team.id },
      { preserveState: false }
    );
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    router.post(route('logout'));
  }

  const { props } = usePage();
  const userAuth = props.auth.user;
  // Se asume que 'notificacionesActivas' se envía desde el backend
  const notificacionesActivas: Notification[] = props.notificacionesActivas || [];


  return (
    <div>
      <Head title={title} />
      <Banner />
  
      {/* Contenedor general sin fondo global, para separar navbar y contenido */}
      <div className="min-h-screen relative">
        {/* Navbar con fondo independiente */}
        <nav className="bg-blue-800 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Izquierda: Logo, enlaces y (opcional) widget de notificaciones */}
              <div className="flex items-center">
                {/* Logo */}
                <div className="my-2 flex-shrink-0 flex items-center animate-small-flicker animate-flicker rounded-full">
                  <Link href={route("dashboard")}>
                    <ApplicationMark className="block h-9 w-auto" />
                  </Link>
                </div>
  
                {/* Enlaces principales (se muestran en sm y superiores) */}
                <div className="hidden space-x-8 lg:-my-px lg:ml-10 lg:flex">
                  <NavLink
                    href={route("products.index")}
                    active={route().current("products.index")}
                  >
                    Productos
                  </NavLink>
                  <NavLink
                    href={route("sales.index")}
                    active={route().current("sales.index")}
                  >
                    Ventas y devoluciones
                  </NavLink>
  
                  {/* Mostrar solo si NO es usuario */}
                  {userAuth?.role?.trim().toLowerCase() !== "usuario" && (
                    <>
                      {/* Solo para super_admin */}
                      {userAuth?.role?.trim().toLowerCase() === "super_admin" && (
                        <>
                          <NavLink
                            href={route("users.index")}
                            active={route().current("users.index")}
                          >
                            Usuarios
                          </NavLink>
                          <NavLink
                            href={route("logs.index")}
                            active={route().current("logs.index")}
                          >
                            Transacciones
                          </NavLink>
                        </>
                      )}
  
                      {/* Devoluciones y Transacciones para admin y super_admin */}
                      <NavLink
                        href={route("refunds.index")}
                        active={route().current("refunds.index")}
                      >
                        Devoluciones
                      </NavLink>
                    </>
                  )}
                </div>
  
              </div>
  
              {/* Derecha: Opciones del usuario y botón de notificaciones (reemplaza al ThemeToggle) */}
              <div className="flex items-center">
                {/* Mostrar NotificationBell solo para super_admin */}
                {userAuth && userAuth.role === "super_admin" && (
                  <div className="mr-4 hidden lg:block">
                    <NotificationBell notifications={notificacionesActivas} />
                  </div>
                )}
  
                {/* Teams Dropdown (si corresponde) */}
                {page.props.jetstream.hasTeamFeatures && (
                  <div className="ml-3 relative hidden lg:block">
                    <Dropdown
                      align="right"
                      width="60"
                      renderTrigger={() => (
                        <span className="inline-flex rounded-md">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-200 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-yellow-400 dark:hover:text-yellow-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition duration-150"
                          >
                            {page.props.auth.user?.current_team?.name}
                            <svg
                              className="ml-2 -mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                    >
                      <div className="w-60">
                        <div className="block px-4 py-2 text-xs text-gray-400">
                          Manage Team
                        </div>
                        {/* Resto del contenido del dropdown */}
                      </div>
                    </Dropdown>
                  </div>
                )}
  
                {/* Settings Dropdown */}
                <div className="ml-3 relative">
                  <Dropdown
                    align="right"
                    width="48"
                    renderTrigger={() =>
                      page.props.jetstream.managesProfilePhotos ? (
                        <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={page.props.auth.user?.profile_photo_url}
                            alt={page.props.auth.user?.name}
                          />
                        </button>
                      ) : (
                        <span className="inline-flex rounded-md">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-200 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-yellow-400 dark:hover:text-yellow-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition duration-150"
                          >
                            {page.props.auth.user?.name}
                            <svg
                              className="ml-2 -mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </button>
                        </span>
                      )
                    }
                  >
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Manage Account
                    </div>
                    <DropdownLink href={route("profile.show")}>
                      Profile
                    </DropdownLink>
                    {page.props.jetstream.hasApiFeatures && (
                      <DropdownLink href={route("api-tokens.index")}>
                        API Tokens
                      </DropdownLink>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600"></div>
                    <form onSubmit={logout}>
                      <DropdownLink as="button">Log Out</DropdownLink>
                    </form>
                  </Dropdown>
                </div>
  
                {/* Botón Hamburguesa (solo en móviles) */}
                <div className="-mr-2 flex items-center lg:hidden">
                  <button
                    onClick={() =>
                      setShowingNavigationDropdown(!showingNavigationDropdown)
                    }
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 transition duration-150"
                  >
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        className={classNames({
                          hidden: showingNavigationDropdown,
                          "inline-flex": !showingNavigationDropdown,
                        })}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                      <path
                        className={classNames({
                          hidden: !showingNavigationDropdown,
                          "inline-flex": showingNavigationDropdown,
                        })}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Menú Responsive (móviles) siempre renderizado */}
        {showingNavigationDropdown && (
          <div
            className={classNames(
              "fixed inset-0 z-50 flex flex-col bg-black bg-opacity-50 transform transition-all duration-300",
              {
                "translate-y-0 opacity-100": showingNavigationDropdown,
                "-translate-y-full opacity-0": !showingNavigationDropdown,
              }
            )}
          >
            {/* Fondo overlay semi-transparente */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowingNavigationDropdown(false)}
            ></div>
            {/* Contenedor del menú */}
            <div className="relative mx-4 mt-20 bg-blue-800 dark:bg-gray-800 rounded-lg p-4">
              {/* Botón para cerrar */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowingNavigationDropdown(false)}
                  className="text-white text-2xl focus:outline-none"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-2 mt-2">
                <ResponsiveNavLink
                  href={route("dashboard")}
                  active={route().current("dashboard")}
                >
                  Dashboard
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("products.index")}
                  active={route().current("products.index")}
                >
                  Productos
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("sales.index")}
                  active={route().current("sales.index")}
                >
                  Ventas y devoluciones
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("users.index")}
                  active={route().current("users.index")}
                >
                  Usuarios
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("refunds.index")}
                  active={route().current("refunds.index")}
                >
                  Devoluciones
                </ResponsiveNavLink>
                <ResponsiveNavLink
                  href={route("logs.index")}
                  active={route().current("logs.index")}
                >
                  Transacciones
                </ResponsiveNavLink>
              </div>
              {/* Opciones de Configuración para móviles */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                <ResponsiveNavLink
                  href={route("profile.show")}
                  active={route().current("profile.show")}
                >
                  Profile
                </ResponsiveNavLink>
                {page.props.jetstream.hasApiFeatures && (
                  <ResponsiveNavLink
                    href={route("api-tokens.index")}
                    active={route().current("api-tokens.index")}
                  >
                    API Tokens
                  </ResponsiveNavLink>
                )}
                <form method="POST" onSubmit={logout}>
                  <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                </form>
              </div>
            </div>
          </div>
        )}
  
        {/* Page Heading */}
        {renderHeader && (
          <header className="bg-blue-500 dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {renderHeader()}
            </div>
          </header>
        )}
  
        {/* Page Content */}
        <main>{children}</main>
        <AnimatedBackground />
      </div>
    </div>
  );
} 
