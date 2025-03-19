import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import { useMemo } from 'react';
import Swal from 'sweetalert2';

// Define la interfaz para los datos del formulario
interface SaleData {
  purchaseDate: Date;
  total: number;
  products: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export default function SalesAndReturns({ products, sales }: any) {
  // Estados para los modales generales
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('hoy');
  const route = useRoute();
  
  // Usa useForm con la interfaz SaleData
  const { data, setData, post, errors } = useForm<SaleData>({
    purchaseDate: new Date().toISOString().split('T')[0],
    total: 0,
    products: [], // Inicialmente vacío
  });

  // Estados para el modal de "Registrar Venta" (Carrito de Compras)
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [newProduct, setNewProduct] = useState<CartItem>({ id: 0, name: '', quantity: 1, price: 0 });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Calcula el total de la venta
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // useEffect para actualizar los datos del formulario cuando cambia el carrito
  useEffect(() => {
    setData('total', total);
    setData(
      'products',
      cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
    );
  }, [cartItems, total, setData]);
  
  
  // Función para filtrar las ventas (sin realizar petición)
  const filteredSales = useMemo(() => {
    if (!sales || !Array.isArray(sales)) return [];
  
    return sales.filter((sale: any) => {
      if (!sale.date) return false; // Evita que `undefined` cause errores
  
      const today = new Date().toISOString().split('T')[0];
      if (filter === 'hoy' && !sale.date.startsWith(today)) {
        return false;
      }
  
      const saleDate = new Date(sale.date);
      if (filter === 'mensual' && saleDate.getMonth() !== new Date().getMonth()) {
        return false;
      }
  
      if (filter === 'anual' && saleDate.getFullYear() !== new Date().getFullYear()) {
        return false;
      }
  
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return sale.product?.toLowerCase().includes(term) || sale.user?.toLowerCase().includes(term);
      }
  
      return true;
    });
  }, [sales, filter, searchTerm]);

  console.log('Ventas filtradas:', filteredSales);

  // Agrega un producto al carrito
  const addProduct = () => {
    if (newProduct.id === 0 || newProduct.quantity <= 0) return;

    

    // Verifica si el producto ya está en el carrito
    const existingItemIndex = cartItems.findIndex(item => item.id === newProduct.id);

    if (existingItemIndex > -1) {
      // Si ya está en el carrito, actualiza la cantidad
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += newProduct.quantity;
      setCartItems(updatedItems);
    } else {
      // Si no está en el carrito, lo agrega como un nuevo item
      setCartItems([...cartItems, newProduct]);
    }

    // Limpia el producto seleccionado después de agregarlo
    setNewProduct({ id: 0, name: '', quantity: 1, price: 0 });
  };

  // Filtra los productos por el nombre ingresado en el input
  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewProduct({ ...newProduct, name: value });
    
    if (value.length > 0) {
      const filtered = products.filter((p: any) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // Selecciona un producto de la lista de sugerencias
  const selectProduct = (product: any) => {
    setNewProduct({ id: product.id, name: product.name, quantity: 1, price: product.price });
    setFilteredProducts([]); // Limpia las sugerencias después de seleccionar
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  const removeProduct = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Si el campo que se cambia es 'purchaseDate'
    if (name === 'purchaseDate') {
      // Si el valor es vacío, asignamos la fecha actual
      const newPurchaseDate = value || new Date().toISOString().split('T')[0];
      
      // Actualizamos el estado local y el estado del formulario
      setPurchaseDate(newPurchaseDate);
      setData((prevData) => ({
        ...prevData,
        purchaseDate: newPurchaseDate, // Aquí actualizamos purchaseDate en el formulario
      }));
    }
  };
  

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("sales.store"), {
      onSuccess: () => {
        console.log("Venta registrada con éxito");
        setCartItems([]);  // Vaciar el carrito
        setData({ total: 0, user_id: 1, products: [] });
        setShowSaleModal(false);
      },
      onError: (errors) => {
        console.log("Errores capturados:", errors); // Verifica en la consola qué llega
        if (errors.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error de stock',
            text: errors.error,
          });
        }
      },
    });
  };
  
  
  

  const handleCancelSale = () => {
    setCartItems([]);  // Vaciar el carrito
    setData({ total: 0, user_id: 1, products: [] }); // Resetear el formulario
    setShowSaleModal(false); // Cerrar el modal
  };
  

//     console.log("Contenido de cartItems antes de enviar:", cartItems);

//     if (cartItems.length === 0) {
//         console.error("No hay productos en el carrito. No se puede registrar la venta.");
//         return;
//     }

//     const saleData = {
//         total: Number(total), 
//         user_id: 1,
//         products: cartItems.map((item) => ({
//             product_id: item.id,
//             quantity: item.quantity,
//             price: item.price,
//         })),
//     };

//     console.log("Payload JSON antes de enviar:", JSON.stringify(saleData, null, 2));

//     post(route("sales.store"), {
//         data: saleData,
//         preserveScroll: true,
//         onSuccess: () => {
//             console.log("Venta registrada con éxito");
//             setShowSaleModal(false);
//         },
//         onError: (errors) => {
//             console.error("Error al registrar la venta:", errors);
//         },
//     });
// };


  return (
    <AppLayout
      title="Ventas y Devoluciones"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-white leading-tight">Ventas y Devoluciones</h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-4" 
                  onClick={() => setShowSaleModal(true)}
                >
                  Registrar Venta
                </button>
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" 
                  onClick={() => setShowReturnModal(true)}
                >
                  Registrar Devolución
                </button>
              </div>
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
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className="overflow-hidden">
                <table className="w-full table-auto overflow-hidden border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border-r border-b border-gray-300">Fecha</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Producto</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Total</th>
                      <th className="px-4 py-2 w-[70px] border-b border-gray-300">opciones?</th>
                    </tr>
                  </thead>
                  {sales.length > 0 ? (
                    <tbody>
                      {sales.map((sale:any) => (
                        <tr key={sale.id} className="border-b border-gray-300 text-white">
                          <td className="px-4 py-2 border-r">{sale.sale_date}</td>
                          <td className="px-4 py-2 border-r">{sale.user.name}</td>
                          <td className="px-4 py-2 border-r">{sale.products.map((product: any) => (
                                        <li key={product.id}>
                                            {product.name} - {product.pivot.quantity} unidades a ${product.pivot.price}
                                        </li>
                                    ))}</td>
                          <td className="px-4 py-2 border-r">{sale.total}</td>
                          <td className="px-4 py-2"><button className='bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700'>eliminar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No se encontraron ventas.
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

      {showSaleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-[500px] border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            <form onSubmit={handleConfirmSale}>
            {/* Fecha de Compra */}
            <label className="block mb-2">Fecha de Compra:</label>
            <input 
              type="date" 
              name="purchaseDate"
              value={purchaseDate} 
              onChange={handleChange}
              className="block w-full mb-4 p-2 border rounded-lg bg-gray-800 text-white" 
            />
            {/* Formulario para agregar un producto */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Agregar Producto</h3>
            {/* Input para Producto con autocompletar */}
            <input 
              type="text" 
              placeholder="Producto" 
              value={newProduct.name} 
              onChange={handleProductInputChange}
              className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
            />
            
            {/* Lista de sugerencias filtradas */}
            {filteredProducts.length > 0 && (
              <ul className="bg-gray-700 rounded-lg mt-1 shadow-lg">
                {filteredProducts.map((prod: any) => (
                  <li 
                    key={prod.id} 
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => selectProduct(prod)}
                  >
                    {prod.name} - ${prod.price}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Input para Cantidad */}
            <input 
              type="number" 
              placeholder="Cantidad" 
              value={newProduct.quantity} 
              onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
              className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
            />
            
            {/* Input para Precio Unitario (no editable) */}
            <input 
              type="number" 
              placeholder="Precio Unitario" 
              value={newProduct.price} 
              disabled 
              className="block w-full mb-2 p-2 border rounded-lg bg-gray-700 text-white" 
            />
            
            <button 
              type="button"
              onClick={addProduct} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full">
              Agregar Producto
            </button>
          </div>


            {/* Tabla tipo factura para productos */}
            <div className="mb-4 overflow-y-auto max-h-40">
              {cartItems.length === 0 ? (
                <p className="text-gray-400">No hay productos en el carrito</p>
              ) : (
                <table className="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-2 py-1 border">Producto</th>
                      <th className="px-2 py-1 border">Cantidad</th>
                      <th className="px-2 py-1 border">Precio U.</th>
                      <th className="px-2 py-1 border">Precio T.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index} className="bg-gray-800">
                        <td className="px-2 py-1 border">{item.name}</td>
                        <td className="px-2 py-1 border">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => updateQuantity(index, item.quantity - 1)} 
                              className="bg-gray-700 px-2 py-1 rounded">-</button>
                            <span>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(index, item.quantity + 1)} 
                              className="bg-gray-700 px-2 py-1 rounded">+</button>
                          </div>
                        </td>
                        <td className="px-2 py-1 border">${item.price}</td>
                        <td className="px-2 py-1 border">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-2 py-1 border"> 
                            <button onClick={() => removeProduct(index)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                              Retirar
                            </button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Total a Pagar */}
            <h3 className="text-xl font-bold mt-4">Total a Pagar: ${total.toFixed(2)}</h3>

            
            {/* Botones de acción */}
            <div className="flex justify-end mt-4">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick ={handleCancelSale}>
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Confirmar Compra
              </button>
            </div>
          </form>
          </div>
        </div>
       )}

      {/* Modal para Registrar Devolución */}
      {showReturnModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Registrar Devolución</h2>
            <input type="text" placeholder="Usuario" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
            <input type="text" placeholder="Referencia del Producto" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
            <input type="date" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={() => setShowReturnModal(false)}>Cancelar</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

