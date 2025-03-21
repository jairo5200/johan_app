import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import ChartComponent from "@/Components/ChartComponent";
import ProductCard from "@/Components/ProductCard";

export default function Dashboard({ products, salesDay, salesWeek, salesMonth }: any) {
  // Filtro para el gráfico dinámico
  const [filter, setFilter] = useState<"day" | "week" | "month">("month");
  // Para la tabla de ventas totales: rango de fechas y filtro de período
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [periodFilter, setPeriodFilter] = useState<"mes" | "bimestral" | "trimestral" | "semestral" | "anual">("mes");

  // Normalizar fecha a partir de un string "YYYY-MM-DD" (sin desfase de zona horaria)
  const normalizeDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // ----------------------
  // Gráficos superiores
  // ----------------------
  const dynamicLabels = {
    day: salesDay.map((s: any) => s.sale_date),
    week: salesWeek.map((_, i: number) => `Semana ${i + 1}`),
    month: salesMonth.map((m: any) => `${m.month}/${m.year}`),
  };

  const dynamicData = {
    day: salesDay.map((s: any) => s.total_sales),
    week: salesWeek.map((s: any) => s.total_sales),
    month: salesMonth.map((m: any) => m.total_sales),
  };

  const currentYear = new Date().getFullYear();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const annualData = Array(12).fill(0);
  salesMonth.forEach((item: any) => {
    if (Number(item.year) === currentYear) {
      const idx = Number(item.month) - 1;
      annualData[idx] = Number(item.total_sales);
    }
  });

  // -----------------------------
  // (Opcional) Si querés seguir usando ventas mensuales consolidadas, lo de salesMonth:
  const filteredSales = salesMonth.filter((m: any) => {
    if (!startDate || !endDate) return true;
    const saleDate = new Date(`${m.year}-${String(m.month).padStart(2, "0")}-01`);
    const normalizedSaleDate = normalizeDate(saleDate.toISOString());
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);
    return normalizedSaleDate >= normalizedStartDate && normalizedSaleDate <= normalizedEndDate;
  });

  let aggregatedSales: { period: string; total: number }[] = [];
  if (periodFilter === "mes") {
    aggregatedSales = filteredSales.map((m: any) => ({
      period: `${m.month}/${m.year}`,
      total: Number(m.total_sales),
    }));
  } else {
    const grouped: Record<string, number> = {};
    filteredSales.forEach((m: any) => {
      let key = "";
      if (periodFilter === "anual") key = `${m.year}`;
      if (periodFilter === "bimestral") key = `Bimestre ${Math.ceil(m.month / 2)} - ${m.year}`;
      if (periodFilter === "trimestral") key = `Trimestre ${Math.ceil(m.month / 3)} - ${m.year}`;
      if (periodFilter === "semestral") key = `Semestre ${Math.ceil(m.month / 6)} - ${m.year}`;
      grouped[key] = (grouped[key] || 0) + Number(m.total_sales);
    });
    aggregatedSales = Object.entries(grouped).map(([period, total]) => ({ period, total }));
  }
  // -----------------------------
  // Tabla de Ventas Totales - usando ventas diarias (más precisas)
  // -----------------------------
  const salesToDisplay = useMemo(() => {
    const filteredDailySales = salesDay.filter((s: any) => {
      if (!startDate || !endDate) return true;
      const saleDate = normalizeDate(s.sale_date);
      const normalizedStart = normalizeDate(startDate);
      const normalizedEnd = normalizeDate(endDate);
      return saleDate >= normalizedStart && saleDate <= normalizedEnd;
    });

    let grouped: Record<string, number> = {};
    filteredDailySales.forEach((s: any) => {
      const date = normalizeDate(s.sale_date);
      let key = "";
      switch (periodFilter) {
        case "mes":
          key = `${date.getMonth() + 1}/${date.getFullYear()}`;
          break;
        case "bimestral":
          key = `Bimestre ${Math.ceil((date.getMonth() + 1) / 2)} - ${date.getFullYear()}`;
          break;
        case "trimestral":
          key = `Trimestre ${Math.ceil((date.getMonth() + 1) / 3)} - ${date.getFullYear()}`;
          break;
        case "semestral":
          key = `Semestre ${Math.ceil((date.getMonth() + 1) / 6)} - ${date.getFullYear()}`;
          break;
        case "anual":
          key = `${date.getFullYear()}`;
          break;
        default:
          key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      }
      grouped[key] = (grouped[key] || 0) + Number(s.total_sales);
    });
    return Object.entries(grouped).map(([period, total]) => ({ period, total }));
  }, [salesDay, startDate, endDate, periodFilter]);

  // Total acumulado de ventas reales (diarias)
  const totalSalesReal = salesToDisplay.reduce(
    (sum: number, s: any) => sum + Number(s.total),
    0
  );
  console.log("Total Sales Real:", totalSalesReal);

  // Función para formatear la fecha para visualización
  const formatDateDisplay = (dateString: string) => {
    const date = normalizeDate(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  



  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-amber-100 leading-tight">
          Dashboard
        </h2>
      )}
    >
      <div className="py-12">
        {/* Sección de gráficos superiores */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Análisis de Balance
            </h2>
            {/* Selector de filtro para gráfico dinámico */}
            
            <div className="flex justify-center mb-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "day" | "week" | "month")}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
              </select>
            </div>
            {/* Contenedor para gráficos */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <ChartComponent
                title="Balance Dinámico"
                labels={dynamicLabels[filter]}
                data={dynamicData[filter]}
              />
              <ChartComponent
                title="Balance Anual"
                labels={monthNames}
                data={annualData}
              />
            </div>
          </div>
        </div>

        {/* Sección de Inventario */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
            <h2 className="font-semibold text-2xl text-amber-100 leading-tight mb-4">
              Inventario
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Sección de Ventas Totales */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-400 shadow-blue-500/50">
            <h2 className="font-semibold text-2xl text-amber-100 leading-tight mb-4">
              Manejo de Ventas Totales
            </h2>
            {/* Filtros: Rango de fechas y periodo */}
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Fecha inicio"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Fecha fin"
              />
              <select
                value={periodFilter}
                onChange={(e) =>
                  setPeriodFilter(
                    e.target.value as
                      | "mes"
                      | "bimestral"
                      | "trimestral"
                      | "semestral"
                      | "anual"
                  )
                }
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="mes">Mes</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>


            {/* Tabla de resultados */}
            <div className="overflow-x-auto">
              {salesToDisplay.length > 0 ? (
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-4 py-2 border">Periodo</th>
                      <th className="px-4 py-2 border">Total Ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesToDisplay.map((item, index) => {
                      const periodDisplay =
                        salesToDisplay.length === 1 && periodFilter === "mes" && startDate && endDate
                          ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`
                          : item.period;
                      return (
                        <tr
                          key={index}
                          className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          <td className="px-4 py-2 border">{periodDisplay}</td>
                          <td className="px-4 py-2 border">
                            {Number(item.total).toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
                  No se encontraron ventas en el rango seleccionado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}




