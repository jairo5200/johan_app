// import React from "react";
// import AppLayout from "@/Layouts/AppLayout";
// import ChartComponent from "@/Components/ChartComponent";

// export default function Dashboard() {
//   return (
//     <AppLayout title="Dashboard">
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           {/* Contenedor único para ambos gráficos */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
//               Análisis de Balance
//             </h2>

//             {/* Contenedor flex para alinear los gráficos en fila */}
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               {/* Primer gráfico */}
//               <ChartComponent
//                 title="Balance de Ingresos"
//                 labels={["Enero", "Febrero", "Marzo", "Abril", "Mayo","Junio"]}
//                 data={[5000, 7000, 6500, 8000]}
//               />

//               {/* Segundo gráfico */}
//               <ChartComponent
//                 title="Balance de Gastos"
//                 labels={["Enero", "Febrero", "Marzo", "Abril"]}
//                 data={[3000, 4000, 3500, 4500]}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AppLayout from "@/Layouts/AppLayout";
// import ChartComponent from "@/Components/ChartComponent";

// export default function Dashboard() {
//   const [filter, setFilter] = useState<"week" | "month" | "year">("month");
//   const [labels, setLabels] = useState<string[]>([]);
//   const [dataIngresos, setDataIngresos] = useState<number[]>([]);
//   const [dataGastos, setDataGastos] = useState<number[]>([]);
  
//   // Función para obtener datos desde el backend
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`/api/dashboard-data?filter=${filter}`);
//       setLabels(response.data.labels);
//       setDataIngresos(response.data.ingresos);
//       setDataGastos(response.data.gastos);
//     } catch (error) {
//       console.error("Error obteniendo datos del backend:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filter]); // Se ejecuta cuando cambia el filtro

//   return (
//     <AppLayout title="Dashboard">
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
//               Análisis de Balance
//             </h2>

//             {/* Selector de filtro */}
//             <div className="flex justify-center mb-6">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value as "week" | "month" | "year")}
//                 className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="week">Semana</option>
//                 <option value="month">Mes</option>
//                 <option value="year">Año</option>
//               </select>
//             </div>

//             {/* Contenedor flex para alinear los gráficos en fila */}
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               <ChartComponent title="Balance de Ingresos" labels={labels} data={dataIngresos} />
//               <ChartComponent title="Balance de Gastos" labels={labels} data={dataGastos} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }


import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import ChartComponent from "@/Components/ChartComponent";

export default function Dashboard() {
  const [filter, setFilter] = useState<"week" | "month" | "year">("month");

  const labels = {
    week: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    month: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    year: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
  };

  const dataIngresos = {
    week: [1200, 1500, 1700, 2000, 2300],
    month: [5000, 7000, 6500, 8000],
    year: [40000, 45000, 42000, 47000, 48000, 50000],
  };

  const dataGastos = {
    week: [800, 1100, 900, 1400, 1700],
    month: [3000, 4000, 3500, 4500],
    year: [25000, 27000, 26000, 28000, 29000, 30000],
  };

  return (
    <AppLayout title="Dashboard">
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Contenedor único para ambos gráficos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Análisis de Balance
            </h2>

            {/* Selector de filtro */}
            <div className="flex justify-center mb-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "week" | "month" | "year")}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="week">Semana</option>
                <option value="month">Mes</option>
                <option value="year">Año</option>
              </select>
            </div>

            {/* Contenedor flex para alinear los gráficos en fila */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {/* Primer gráfico */}
              <ChartComponent
                title="Balance de Ingresos"
                labels={labels[filter]}
                data={dataIngresos[filter]}
              />

              {/* Segundo gráfico */}
              <ChartComponent
                title="Balance de Gastos"
                labels={labels[filter]}
                data={dataGastos[filter]}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
