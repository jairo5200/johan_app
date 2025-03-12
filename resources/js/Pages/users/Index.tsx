import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

export default function Users({ users }: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
    const route = useRoute();
  const { delete: deleteUser } = useForm(); // Aquí usamos delete para manejar la solicitud DELETE
  const { data, setData, post, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'usuario', // Valor predeterminado para el rol
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onFinish: () => console.log('Formulario enviado con éxito'),
    });
  };

  const handleDeleteUser = (userId: number) => {
    deleteUser(route('users.destroy', userId), {
      onSuccess: () => {
        // Aquí puedes hacer algo cuando la eliminación sea exitosa
        console.log('Usuario eliminado con éxito');
        // Actualizar la lista de usuarios o redirigir a otra página
      },
      onError: (errors) => {
        // Manejo de errores
        console.error('Error al eliminar el usuario:', errors);
      }
    });
  };

  const handleAddUser = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);
  const closeDeleteModal = () => setShowDeleteModal(false);


  return (
    <AppLayout
      title="Usuarios"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-white leading-tight">Usuarios</h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Usuarios</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleAddUser}>
                Agregar Usuario
              </button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className='overflow-hidden'>
                <table className="w-full table-auto overflow-hidden border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border-r border-b border-gray-300">ID Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Nombre</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Email</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Role</th>
                      <th className="px-4 py-2 border-b border-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user: any, index: number) => (
                        <tr key={index} className="text-center text-white bg-gray-800 border-b border-gray-300">
                          <td className="px-4 py-2 border-r border-b border-gray-300">{user.id}</td>
                          <td className="px-4 py-2 border-r border-b border-gray-300">{user.name}</td>
                          <td className="px-4 py-2 border-r border-b border-gray-300">{user.email}</td>
                          <td className="px-4 py-2 border-r border-b border-gray-300">{user.role}</td>
                          <td className="px-4 py-2 border-b border-gray-300">
                            <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" onClick={() => handleDeleteUser(user.id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-2 text-center text-white">No hay usuarios disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Eliminar Usuario</h2>
            <p>¿Estás seguro de que deseas eliminar a {selectedUser?.name}?</p>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={closeDeleteModal}>Cancelar</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <>
        <Head title="Crear Usuario" />
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Agregar Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full p-2 border rounded-md"
                value={data.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="text-red-500 text-xs mt-2">{errors.name}</div>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full p-2 border rounded-md"
                value={data.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="text-red-500 text-xs mt-2">{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full p-2 border rounded-md"
                value={data.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="text-red-500 text-xs mt-2">{errors.password}</div>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                className="mt-1 block w-full p-2 border rounded-md"
                value={data.password_confirmation}
                onChange={handleChange}
                required
              />
              {errors.password_confirmation && <div className="text-red-500 text-xs mt-2">{errors.password_confirmation}</div>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                name="role"
                id="role"
                className="mt-1 block w-full p-2 border rounded-md"
                value={data.role}
                onChange={handleChange}
                required
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.role && <div className="text-red-500 text-xs mt-2">{errors.role}</div>}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar Usuario
              </button>
            </div>
          </form>
        </div>
      </>
      )}
    </AppLayout>
  );
}
