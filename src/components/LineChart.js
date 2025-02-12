import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CheckoutChart = () => {
    const [chartData, setChartData] = useState(null);
    const [monthlyTotals, setMonthlyTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('/api/books/checkout-trends');
              const { daily_checkouts, monthly_totals } = response.data;

              // Format dates for display
              setChartData({
                  labels: daily_checkouts.map(item => {
                      const date = new Date(item.date);
                      return date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                      });
                  }),
                  datasets: [{
                      label: "Daily Checkouts",
                      data: daily_checkouts.map(item => item.count),
                      borderColor: "rgba(75, 192, 192, 1)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      fill: true,
                      tension: 0.4,
                  }],
              });

              // Process monthly totals
              const monthlyData = monthly_totals.reduce((acc, { month, total }) => {
                  acc[month] = total;
                  return acc;
              }, {});
              setMonthlyTotals(monthlyData);

          } catch (err) {
              console.error("Error fetching data:", err);
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="text-gray-500 text-center p-4">
                No checkout data available
            </div>
        );
    }

    const chartOptions = {
      responsive: true,
      plugins: {
          legend: {
              position: 'top',
          },
          title: {
              display: true,
              text: 'Daily Checkout Trends (Last 30 Days)',
              font: {
                  size: 16,
                  family: 'Poppins, sans-serif',
              }
          },
          tooltip: {
              callbacks: {
                  title: function(context) {
                      return context[0].label;
                  },
                  label: function(context) {
                      return `Checkouts: ${context.parsed.y}`;
                  }
              }
          }
      },
      scales: {
          x: {
              grid: {
                  display: false
              },
              ticks: {
                  maxRotation: 45,
                  minRotation: 45
              }
          },
          y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: 'Number of Checkouts'
              }
          }
      }
  };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-8">
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Monthly Totals</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                <th className="px-6 py-3 border-b text-right text-xs font-medium text-gray-500 uppercase">Total Checkouts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(monthlyTotals).map(([month, total]) => (
                                <tr key={month} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{month}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900 text-right">{total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CheckoutChart;