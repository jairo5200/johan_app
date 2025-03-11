import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface ChartProps {
  title: string;
  labels: string[];
  data: number[];
}

const ChartComponent: React.FC<ChartProps> = ({ title, labels, data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const myChart = new Chart(ctx, {
        type: "bar", // Puedes cambiar a 'line' si quieres otro tipo de gráfico
        data: {
          labels: labels,
          datasets: [
            {
              label: title,
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 2,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [title, labels, data]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl 
                    border-4 border-blue-300 shadow-blue-300/10">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="relative w-full h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
  
};

export default ChartComponent;

