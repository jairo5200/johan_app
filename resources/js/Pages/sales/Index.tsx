// import React, { useState } from 'react';
// import AppLayout from '@/Layouts/AppLayout';

// export default function SalesAndReturns() {
//   const [showSaleModal, setShowSaleModal] = useState(false);
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('hoy');

//   return (
//     <AppLayout
//       title="Ventas y Devoluciones"
//       renderHeader={() => (
//         <h2 className="font-semibold text-xl text-white leading-tight">Ventas y Devoluciones</h2>
//       )}
//     >
//       <div className="py-12">
//         <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <button 
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-4" 
//                   onClick={() => setShowSaleModal(true)}
//                 >
//                   Registrar Venta
//                 </button>
//                 <button 
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" 
//                   onClick={() => setShowReturnModal(true)}
//                 >
//                   Registrar Devolución
//                 </button>
//               </div>
//               <div className="flex space-x-4">
//                 <input 
//                   type="text" 
//                   placeholder="Buscar..." 
//                   className="p-2 border rounded-lg bg-gray-800 text-white" 
//                   value={searchTerm} 
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <select 
//                   className="p-2 border rounded-lg bg-gray-800 text-white" 
//                   value={filter} 
//                   onChange={(e) => setFilter(e.target.value)}
//                 >
//                   <option value="hoy">Hoy</option>
//                   <option value="mensual">Mensual</option>
//                   <option value="anual">Anual</option>
//                 </select>
//               </div>
//             </div>
//             <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
//               <div className='overflow-hidden'>
//                 <table className="w-full table-auto overflow-hidden border-collapse">
//                   <thead>
//                     <tr className="bg-gray-700 text-white">
//                       <th className="px-4 py-2 border-r border-b border-gray-300">Día</th>
//                       <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
//                       <th className="px-4 py-2 border-r border-b border-gray-300">Producto</th>
//                       <th className="px-4 py-2 border-r border-b border-gray-300">Referencia</th>
//                       <th className="px-4 py-2 w-[70px] border-r border-b border-gray-300">Cantidad</th>
//                       <th className="px-4 py-2 w-[70px] border-b border-gray-300">Stock</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {/* {users.length > 0 ? (
//                       users.map((user: any, index: number) => (
//                         <tr key={index} className="text-center text-white bg-gray-800 border-b border-gray-300">
//                           <td className="px-4 py-2 border-r border-b border-gray-300">{user.name}</td>
//                           <td className="px-4 py-2 border-r border-b border-gray-300">{user.id_usuario}</td>
//                           <td className="px-4 py-2 border-r border-b border-gray-300">{user.email}</td>
//                           <td className="px-4 py-2 border-r border-b border-gray-300">{user.rol}</td>
//                           <td className="px-4 py-2 border-b border-gray-300">
//                             <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" onClick={() => handleDeleteUser(user)}>
//                               Eliminar
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={5} className="px-4 py-2 text-center text-white">No hay usuarios disponibles</td>
//                       </tr>
//                     )} */}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal para Registrar Venta */}
//       {showSaleModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
//             <h2 className="text-2xl font-bold mb-4">Registrar Venta</h2>
//             <input type="text" placeholder="Usuario" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <input type="text" placeholder="Referencia del Producto" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <input type="date" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <input type="text" placeholder="Valor de la Venta" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <div className="flex justify-end mt-4">
//               <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={() => setShowSaleModal(false)}>Cancelar</button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal para Registrar Devolución */}
//       {showReturnModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
//             <h2 className="text-2xl font-bold mb-4">Registrar Devolución</h2>
//             <input type="text" placeholder="Usuario" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <input type="text" placeholder="Referencia del Producto" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <input type="date" className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" />
//             <div className="flex justify-end mt-4">
//               <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2" onClick={() => setShowReturnModal(false)}>Cancelar</button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Guardar</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </AppLayout>
//   );
// }



import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function SalesAndReturns() {
  // Estados para los modales generales
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('hoy');

  // Estados para el modal de "Registrar Venta" (Carrito de Compras)
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 1, price: 0 });
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const addProduct = () => {
    if (!newProduct.name || newProduct.quantity <= 0 || newProduct.price <= 0) return;
    setCartItems([...cartItems, newProduct]);
    setNewProduct({ name: '', quantity: 1, price: 0 });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  const confirmPurchase = () => {
    console.log("Compra confirmada:", { purchaseDate, cartItems, total });
    setShowSaleModal(false);
  };

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
                      <th className="px-4 py-2 border-r border-b border-gray-300">Día</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Producto</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Referencia</th>
                      <th className="px-4 py-2 w-[70px] border-r border-b border-gray-300">Cantidad</th>
                      <th className="px-4 py-2 w-[70px] border-b border-gray-300">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Datos de la tabla (ventas o inventario) */} 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSaleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-96 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            
            {/* Fecha de Compra */}
            <label className="block mb-2">Fecha de Compra:</label>
            <input 
              type="date" 
              value={purchaseDate} 
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="block w-full mb-4 p-2 border rounded-lg bg-gray-800 text-white" 
            />

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Total a Pagar */}
            <h3 className="text-xl font-bold mt-4">Total a Pagar: ${total.toFixed(2)}</h3>
            
            {/* Formulario para agregar un producto */}
            <div className="mt-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Agregar Producto</h3>
              
              {/* Seleccionar Producto */}
              <input 
                type="text" 
                placeholder="Producto" 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
              />
              
              {/* Cantidad de productos */}
              <input 
                type="number" 
                placeholder="Cantidad" 
                value={newProduct.quantity} 
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} 
                className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
              />
              
              {/* Precio Unitario (rellenado desde la base de datos y no editable) */}
              <input 
                type="number" 
                placeholder="Precio Unitario" 
                value={newProduct.price} 
                disabled 
                className="block w-full mb-2 p-2 border rounded-lg bg-gray-700 text-white" 
              />
              
              <button 
                onClick={addProduct} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full">
                Agregar Producto
              </button>
            </div>
            {/* Botones de acción */}
            <div className="flex justify-end mt-4">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => setShowSaleModal(false)}>
                Cancelar
              </button>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={confirmPurchase}>
                Confirmar Compra
              </button>
            </div>
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


