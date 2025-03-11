import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Users({ users }: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Usuario',
  });

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`/users/${selectedUser.id}`, {  // Aquí van las comillas invertidas
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });
        
        if (response.ok) {
          console.log('Usuario eliminado:', selectedUser);
          setShowDeleteModal(false);
          // Aquí puedes actualizar la lista de usuarios o recargar la página si es necesario
          window.location.reload();
        } else {
          console.error('Error al eliminar el usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };

  const handleAddUser = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

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
                      <th className="px-4 py-2 border-r border-b border-gray-300">Rol</th>
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
                            <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" onClick={() => handleDeleteUser(user)}>
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
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" onClick={confirmDeleteUser}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Agregar Usuario</h2>
            <input type="text" name="name" placeholder="Nombre"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
            <input type="text" name="cedula" placeholder="Cedula" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange}/>
            <input type="email" name="email" placeholder="Email"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
            <input type="password" name="password" placeholder="Contraseña"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
            <select name="role" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange}>
                    <option value="Usuario">Usuario</option>
                    <option value="Administrador">Administrador</option>
                  </select>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={closeAddUserModal}>Cancelar</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}