import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const dailyTotals = {};

    transactions?.forEach((transaction) => {
      const date = new Date(transaction.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!dailyTotals[day]) {
        dailyTotals[day] = 0;
      }
      dailyTotals[day] += transaction.total_payment;
    });

    const labels = Object.keys(dailyTotals);
    const data = Object.values(dailyTotals);

    setChartData({
      labels,
      datasets: [
        {
          label: "Total Sales",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [transactions]);

  return (
    <div className="lg:ml-[500px] bg-white p-5 lg:w-[600px] lg:mt-7 rounded-md lg:h-[300px] shadow-lg">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.raw.toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
