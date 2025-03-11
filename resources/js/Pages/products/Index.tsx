import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import ProductItem from '@/Components/ProductItem';
import BarraBusqueda from "@/Components/BarraBusqueda";

export default function Products({ products }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 1; // Elementos por página

  // Filtra los productos por nombre
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reiniciar la página a 1 cuando el término de búsqueda cambia
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Calcular los elementos a mostrar según la página usando los productos filtrados
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  
  const handleDeleteUser = (user: any) => {
    setSelectedProduct(user);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteUser = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(`/users/${selectedProduct.id_usuario}`, {  // Aquí van las comillas invertidas
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });
        
        if (response.ok) {
          console.log('producto eliminado:', selectedProduct);
          setShowDeleteModal(false);
          // Aquí puedes actualizar la lista de usuarios o recargar la página si es necesario
          window.location.reload();
        } else {
          console.error('Error al eliminar el producto');
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
      title="Products" 
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Productos
        </h2>
      )}
    >
      <div className="py-12"></div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        <div className='bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Productos</h1>
            <div className='flex items-center'>
              <div>
                <BarraBusqueda setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleAddUser}>
                Agregar Producto
              </button>
            </div>
            
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
            <div className='overflow-hidden'>
              <table className="w-full table-auto overflow-hidden border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-4 py-2 w-[70px] border-r border-b border-gray-300">Imagen</th>
                    <th className="px-4 py-2 w-[200px] border-r border-b border-gray-300">Producto</th>
                    <th className="px-4 py-2 w-[600px] border-r border-b border-gray-300">Descripcion</th>
                    <th className="px-4 py-2 w-[70px] text-center border-r border-b border-gray-300">Precio</th>
                    <th className="px-2 py-2 w-[60px] text-center border-r border-b border-gray-300">Stock</th>
                    <th className="px-4 py-2 border-b border-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((product: any) => (
                    <ProductItem key={product.id} product={product} handleDeleteUser={handleDeleteUser} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 0 && (
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
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Eliminar Producto</h2>
                <p>¿Estás seguro de que deseas eliminar a {selectedProduct?.name}?</p>
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
                <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
                <input type="text" name="name" placeholder="Nombre del producto"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
                <input type="text" name="Description" placeholder="Descripcion"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
                <input type="text" name="price" placeholder="Precio"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
                <input type="text" name="stock" placeholder="Stock"  className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" onChange={handleChange} />
                <div className="flex justify-end mt-4">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={closeAddUserModal}>Cancelar</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}