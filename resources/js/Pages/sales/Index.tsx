import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import { useMemo } from 'react';
import { showAlert, showConfirmAlert } from "@/Components/Showalert2";
import { usePage } from '@inertiajs/react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import 'animate.css';

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
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  useEffect(() => {
    if (showSaleModal) {
      const today = new Date().toISOString().split("T")[0];
      setPurchaseDate(today);
      setData((prev) => ({
        ...prev,
        purchaseDate: today,
      }));
    }
  }, [showSaleModal]);


  // Usa useForm con la interfaz SaleData
  const { data, setData, post, errors, reset } = useForm<SaleData>({
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
      if (!sale.sale_date) return false; // Asegurar que tenga fecha

      // Conversión de fecha para comparación
      const saleDate = new Date(sale.sale_date);
      const isToday = sale.sale_date.startsWith(todayISO);
      const isMonthly = saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
      const isYearly = saleDate.getFullYear() === today.getFullYear();

      // Aplicar filtro de fecha
      if (filter === 'hoy' && !isToday) return false;
      if (filter === 'mensual' && !isMonthly) return false;
      if (filter === 'anual' && !isYearly) return false;

      // Filtro de búsqueda
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          sale.user?.name?.toLowerCase().includes(term) || 
          sale.products.some((product: any) => product.name.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }, [sales, filter, searchTerm]);


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
  
    console.log("Enviando datos a Inertia...");
  
    post(route("sales.store"), {
      preserveScroll: true, // Evita que la página haga un refresh inesperado
      onSuccess: () => {
        console.log("Venta registrada con éxito");
  
        showAlert("Venta exitosa", "La venta se ha registrado correctamente", "success")
          .then(() => {
            console.log("Alerta cerrada, reseteando datos...");
  
            // 🔹 Restaurar estado correctamente
            setCartItems([]);
            setData({
              total: 0,
              user_id: 1,
              purchaseDate: new Date().toISOString().split("T")[0], // Asegurar que la fecha esté siempre presente
              products: []
            });
  
            reset(); 
            setShowSaleModal(false);
          });
      },
      onError: (errors) => {
        showAlert("error", errors.products ,"error")
        console.log("Errores capturados:", errors);
  
        if (errors.purchaseDate) {
          console.log("Error: falta la fecha de compra");
  
          // 🔹 Restaurar `purchaseDate` automáticamente para evitar futuros errores
          setData((prev) => ({
            ...prev,
            purchaseDate: new Date().toISOString().split("T")[0] // Se asegura de que siempre tenga una fecha válida
          }));
  
          showAlert("Error en la venta", "La fecha de compra es obligatoria", "error");
        } else if (errors.error) {
          console.log("Error de stock detectado");
  
          showAlert("Error de stock", errors.error, "error")
            .then(() => {
              console.log("Error de stock cerrado, restaurando datos...");
  
              // 🔹 Restaurar `purchaseDate` después de un error de stock también
              setData((prev) => ({
                ...prev,
                purchaseDate: new Date().toISOString().split("T")[0] 
              }));
            });
        }
      },
    });
  
    console.log("post() ha sido ejecutado");
  };
  const { delete: deleteSale } = useForm();

  const confirmDeleteSale = (saleId: number) => {
    showConfirmAlert(
      "¿Estás seguro?",
      "Esta acción no se puede deshacer",
      "Sí, eliminar",
      "Cancelar"
    ).then((result) => {
      if (result.isConfirmed) {
        deleteSale(route("sales.destroy", saleId), {
          preserveScroll: true,
          onSuccess: () => {
            showAlert("Venta eliminada", "La venta se ha eliminado correctamente", "success");
          },
          onError: (errors) => {
            console.error("Error al eliminar la venta:", errors);
            showAlert("Error", errors.error || "Ocurrió un error al eliminar la venta", "error");
          },
        });
      }
    });
  };
  
  
  
  
  

  const handleCancelSale = () => {
    setCartItems([]);  // Vaciar el carrito
    setData({ total: 0, user_id: 1, products: [] }); // Resetear el formulario
    setShowSaleModal(false); // Cerrar el modal
  };

  const { data: returnData, setData: setReturnData, post: postReturn, reset: resetReturn } = useForm({
    reason: '',
    client: '',
    product: '', // o product_id: ''
    refundDate: new Date().toISOString().split('T')[0],
  });
  const [returnFilteredProducts, setReturnFilteredProducts] = useState<any[]>([]);
  
  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postReturn(route('refunds.store'), {
      onSuccess: () => {
        console.log("Devolución registrada con éxito");
        

        setTimeout(() => {
          showAlert(
            "Devolución exitosa",
            "La devolución se ha registrado correctamente",
            "success"
          );
        }, 100);

        resetReturn();
        setShowReturnModal(false);
      },
      onError: (errors) => {
        if(errors.reason){
          showAlert("error", errors.reason,"error")
        }else if(errors.client){
          showAlert("error",errors.client ,"error")
        }else if(errors.product){
          showAlert("error", errors.product ,"error")
        }
        
        console.error("Error al registrar la devolución:", errors);
        if (errors.error) {
          setTimeout(() => {
            showAlert(
              "Error en la devolución",
              errors.error,
              "error"
            );
  
          });
        }
      },
    });
  };

  
  const handleReturnProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Actualiza el campo "product" en returnData
    setReturnData('product', value);
    
    if (value.trim().length > 0) {
      // Filtra la lista de productos (suponiendo que "products" es la lista completa que recibes)
      const filtered = products.filter((p: any) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setReturnFilteredProducts(filtered);
    } else {
      setReturnFilteredProducts([]);
    }
  };
  
  const selectReturnProduct = (product: any) => {
    // Actualiza el campo "product" en returnData con el nombre del producto (o puedes guardar el id en otro campo)
    setReturnData('product', product.name);
    // Limpia las sugerencias
    setReturnFilteredProducts([]);
  };
  
  //Funciones para paginacion.
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const paginatedSales = [...filteredSales].reverse().slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  

  const { props }:any = usePage();
  const userAuth = props.auth.user;

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };
  

  return (
    <AppLayout
      title="Ventas y Devoluciones"
      renderHeader={() => (
        <h2 className="font-semibold text-xl leading-tight text-amber-100 animate__animated animate__slideInRight">
          Ventas y Devoluciones
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="dark:bg-gray-800/50 rounded-lg shadow-lg p-8 border-2 border-gray-400 shadow-blue-500/50">
            
            {/* Botones de acción */}
            <div className="overflow-x-auto flex justify-between items-center mb-4">
              <div className='flex mr-4'>
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
  
              {/* Filtros */}
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Buscar por usuario o producto..." 
                  className="p-2 border rounded-lg bg-gray-800 text-white" 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reinicia la página al cambiar búsqueda
                  }}
                />
                <select 
                  className="p-2 border rounded-lg bg-gray-800 text-white" 
                  value={filter} 
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1); // Reinicia la página al cambiar filtro
                  }}
                >
                  <option value="hoy">Hoy</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>
  
            {/* Tabla de ventas */}
            <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300">
              <div className="">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="dark:bg-gray-700 dark:text-white light:text-black">
                      <th className="px-4 py-2 border-r border-b border-gray-300">Fecha</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Usuario</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Productos</th>
                      <th className="px-4 py-2 border-r border-b border-gray-300">Total</th>
                      <th className="px-4 py-2 w-[70px] border-b border-gray-300">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.length > 0 ? (
                      paginatedSales.map((sale: any) => (
                        <tr key={sale.id} className="border-b border-gray-300 text-white">
                          <td className="px-4 py-2 border-r">{sale.sale_date}</td>
                          <td className="px-4 py-2 border-r">{sale.user?.name || "Sin usuario"}</td>
                          <td className="px-4 py-2 border-r">
                            {sale.products?.length > 0
                              ? sale.products.map((product: any, index: number) => (
                                  <span key={index}>
                                    {product.name} ({product.pivot.quantity}x) - {formatCOP(product.pivot.price)}
                                    {index !== sale.products.length - 1 && ", "}
                                  </span>
                                ))
                              : "Sin productos"}
                          </td>
                          <td className="px-4 py-2 border-r">{formatCOP(sale.total)}</td>
                          <td className="px-4 py-2 text-center">
                          {(userAuth?.role?.trim().toLowerCase() !== "usuario") ? (
                            <button 
                              onClick={() => confirmDeleteSale(sale.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          ) : (
                            <div className="flex justify-center text-gray-400">
                              <LockClosedIcon className="h-5 w-5" title="Sin permisos" />
                            </div>
                          )}
                        </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-white">
                          No se encontraron ventas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* Paginación */}
            {totalPages > 1 && (
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
                      page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
  
          </div>
        </div>
      </div>

      {showSaleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate__animated animate__zoomIn">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-[500px] border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
            <form onSubmit={handleConfirmSale}>
            {/* Fecha de Compra */}
            <label className="block mb-2">Fecha de Compra:</label>
            <input 
              type="date" 
              name="purchaseDate"
              value={purchaseDate} 
              readOnly
              className="block w-full mb-4 p-2 border rounded-lg bg-gray-800 text-white cursor-not-allowed" 
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
                    {prod.name} - {formatCOP(prod.price)}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Input para Cantidad */}
            <input 
              type="number" 
              placeholder="Cantidad" 
              value={newProduct.quantity} 
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value)); // Evita valores negativos
                setNewProduct({ ...newProduct, quantity: value });
              }}
              className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
            />
            
            {/* Input para Precio Unitario (no editable) */}
            <input 
              type="text" 
              placeholder="Precio Unitario" 
              value={newProduct.price ? formatCOP(newProduct.price) : ''} 
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
                              type="button" 
                              onClick={() => updateQuantity(index, item.quantity - 1)} 
                              className="bg-gray-700 px-2 py-1 rounded">-</button>
                            <span>{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQuantity(index, item.quantity + 1)} 
                              className="bg-gray-700 px-2 py-1 rounded">+</button>
                          </div>
                        </td>
                        <td className="px-2 py-1 border">{formatCOP(item.price)}</td>
                        <td className="px-2 py-1 border">{formatCOP(item.price * item.quantity)}</td>
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
            <h3 className="text-xl font-bold mt-4">Total a Pagar: {formatCOP(total)}</h3>

            
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate__animated animate__zoomIn">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-white w-[500px] border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Registrar Devolución</h2>
            <form onSubmit={handleReturnSubmit}>
              {/* Campo para el motivo (ahora con textarea) */}
              <textarea
                name="reason"
                placeholder="Motivo de la devolución..."
                value={returnData.reason}
                onChange={(e) => setReturnData('reason', e.target.value)}
                className="block w-full h-24 mb-2 p-2 border rounded-lg bg-gray-800 text-white resize-none"
              />
              
              {/* Input para Producto con autocompletar */}
              <input 
                type="text" 
                name="product"
                placeholder="Producto" 
                value={returnData.product} 
                onChange={handleReturnProductInputChange}
                className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
              />
              {returnFilteredProducts.length > 0 && (
                <ul className="bg-gray-700 rounded-lg mt-1 shadow-lg">
            {returnFilteredProducts.map((prod: any) => (
              <li 
                key={prod.id} 
                className="p-2 hover:bg-gray-600 cursor-pointer"
                onClick={() => selectReturnProduct(prod)}
              >
                {prod.name} - {formatCOP(prod.price)}
              </li>
            ))}
          </ul>
        )}

        {/* Campo para los datos del cliente */}
        <input 
          type="text" 
          name="client"
          placeholder="Datos del cliente" 
          value={returnData.client} 
          onChange={(e) => setReturnData('client', e.target.value)}
          className="block w-full mb-2 p-2 border rounded-lg bg-gray-800 text-white" 
        />

        {/* Fecha de Compra */}
        <label className="block mb-2">Fecha de Compra:</label>
        <input 
            type="date" 
            name="refundDate"
            value={returnData.refundDate} 
            readOnly
            className="block w-full mb-4 p-2 border rounded-lg bg-gray-800 text-white cursor-not-allowed" 
          />

        <div className="flex justify-end mt-4">
          <button 
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={() => {
              resetReturn();
              setShowReturnModal(false);
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
)}




    </AppLayout>
  );
}

