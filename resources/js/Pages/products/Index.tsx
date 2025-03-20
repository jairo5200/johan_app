import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import ProductItem from '@/Components/ProductItem';
import BarraBusqueda from "@/Components/BarraBusqueda";
import useRoute from '@/Hooks/useRoute';

interface EditData {
  name: string;           // El nombre del producto, que debe ser una cadena de texto
  description: string;    // La descripción del producto, que también debe ser una cadena
  price: string;          // El precio del producto, que debe ser un número
  stock: string ;   // El stock del producto, que debe ser un número, y puede ser null si no se proporciona
  image: File | null;     // La imagen del producto, puede ser un archivo (File) o null si no se proporciona
}

export default function Products({ products }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Elementos por página
  const route = useRoute();
  const [user, setUser] = useState(null); // Estado para guardar el ID del usuario

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

  const { delete: deleteProduct, post, data, setData, errors } = useForm({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<any>(null);

  const { put: putEdit, data: editData, setData: setEditData, errors: editErrors } = useForm<EditData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  // Manejar clic en editar
  const handleEditProduct = (product: any) => {
    setSelectedProductForEdit(product);
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null, // No establecer la imagen actual aquí para evitar problemas
    });
    setShowEditModal(true);
  };
  // Manejar cambio en formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setEditData({
        ...editData,
        [name]: files[0],
      });
    } else {
      setEditData({
        ...editData,
        [name]: value,
      });
    }
  };

  // Enviar formulario de edición
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Para método PUT en Laravel
    formData.append('name', editData.name);
    formData.append('description', editData.description);
    formData.append('price', editData.price);
    formData.append('stock', editData.stock);
    
    if (editData.image) {
      formData.append('image', editData.image);
    }

    if (selectedProductForEdit) {
      console.log(formData);
      putEdit(route('products.update', selectedProductForEdit.id), {
        onSuccess: () => {
          setShowEditModal(false);
          console.log('Producto actualizado');
        },
        onError: (errors) => {
          console.error('Error al actualizar el producto', errors);
        },
      });
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = () => {
      deleteProduct(route('products.destroy', selectedProduct.id), {
        onSuccess: () => {
          setShowDeleteModal(false);
        },
        onError: (errors) => {
          console.error('Error al eliminar el producto', errors);
        },
      });
  };

  const handleAddProduct = () => setShowAddProductModal(true);
  const closeAddProductModal = () => setShowAddProductModal(false);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      // Si el campo es una imagen, actualizamos el archivo
      setData({
        ...data,
        [name]: files[0], // Guardamos el archivo seleccionado
      });
    } else {
      // Si es un input regular, lo guardamos en el state
      setData({
        ...data,
        [name]: value,
      });
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();  // Creamos un nuevo FormData

    // Agregamos los campos del formulario al FormData
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);

    // Agregamos el archivo de imagen (si lo hay)
    if (data.image) {
      formData.append('image', data.image);
    }

    // Enviamos el formulario usando FormData
    post(route('products.store'), {
      data: formData,  // Aquí pasamos el FormData
      onSuccess: () => {
        setShowAddProductModal(false);
        console.log('Producto agregado con éxito');
      },
    });
  };
  return (
    <AppLayout
      title="Productos"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Productos
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 pt-4 border-2 border-gray-400 shadow-blue-500/50'>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Productos</h1>
              <div className='flex items-center'>
                <div>
                  <BarraBusqueda setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleAddProduct}>
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
                      <ProductItem key={product.id} product={product} handleDeleteProduct={handleDeleteProduct} handleEditProduct={handleEditProduct}/>
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

            {/* Modal Eliminar Producto */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4">Eliminar Producto</h2>
                  <p>¿Estás seguro de que deseas eliminar a {selectedProduct?.name}?</p>
                  <div className="flex justify-end mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={closeDeleteModal}>Cancelar</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" onClick={confirmDeleteProduct}>Confirmar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Agregar Producto */}
            {showAddProductModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre del producto"
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Descripción"
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="price"
                      placeholder="Precio"
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="stock"
                      placeholder="Stock"
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleChange}
                    />
                      <div className="col-sm">
                          <div className="grid grid-cols-1  mx-7">
                              <label className="uppercase md:text-m text-m text-black text-black font-semibold mb-1">Subir Imagen</label>
                                  <div className='flex items-center justify-center w-full'>
                                      <label className='flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-purple-300 group'>
                                          <div className='flex flex-col items-center justify-center pt-7'>
                                          <svg className="w-10 h-10 text-purple-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                          <p className='text-sm text-gray-400 group-hover:text-purple-600 pt-1 tracking-wider'>Seleccione la imagen</p>
                                          </div>
                                      <input name="image" id="image" type='file' className="hidden" onChange={handleChange} />
                                      </label>
                                  </div>
                          </div>
                      </div>
                    <div className="flex justify-end mt-4">
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={closeAddProductModal}>Cancelar</button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showEditModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre del producto"
                      value={editData.name}
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleEditChange}
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Descripción"
                      value={editData.description}
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleEditChange}
                    />
                    <input
                      type="text"
                      name="price"
                      placeholder="Precio"
                      value={editData.price}
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleEditChange}
                    />
                    <input
                      type="text"
                      name="stock"
                      placeholder="Stock"
                      value={editData.stock}
                      className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white"
                      onChange={handleEditChange}
                    />
                    <div className="mb-4">
                      <label className="block mb-2">Imagen actual:</label>
                      <img 
                        src={`/img/${selectedProductForEdit?.image}`} 
                        alt="Current" 
                        className="w-20 h-20 object-cover mb-2"
                      />
                    </div>
                    <div className="col-sm">
                      <div className="grid grid-cols-1 mx-7">
                        <label className="uppercase md:text-m text-m text-black font-semibold mb-1">
                          Nueva Imagen (opcional)
                        </label>
                        <div className='flex items-center justify-center w-full'>
                          <label className='flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-purple-300 group'>
                            <div className='flex flex-col items-center justify-center pt-7'>
                              <svg className="w-10 h-10 text-purple-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className='text-sm text-gray-400 group-hover:text-purple-600 pt-1 tracking-wider'>Seleccione nueva imagen</p>
                            </div>
                            <input 
                              name="image" 
                              id="image" 
                              type='file' 
                              className="hidden" 
                              onChange={handleEditChange} 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button 
                        type="button" 
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" 
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
