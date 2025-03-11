import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import ChartComponent from "@/Components/ChartComponent";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Contenedor único para ambos gráficos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Análisis de Balance
            </h2>

            {/* Contenedor flex para alinear los gráficos en fila */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {/* Primer gráfico */}
              <ChartComponent
                title="Balance de Ingresos"
                labels={["Enero", "Febrero", "Marzo", "Abril"]}
                data={[5000, 7000, 6500, 8000]}
              />

              {/* Segundo gráfico */}
              <ChartComponent
                title="Balance de Gastos"
                labels={["Enero", "Febrero", "Marzo", "Abril"]}
                data={[3000, 4000, 3500, 4500]}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
