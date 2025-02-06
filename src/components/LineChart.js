import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CheckoutChart = () => {
  const [data, setData] = useState([]); // Holds fetched data
  const [chartData, setChartData] = useState(null); // Holds chart data
  const [monthlyTotals, setMonthlyTotals] = useState({}); // Holds monthly totals
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Formated data.json"); // Ensure correct path
        if (!response.ok) throw new Error("Failed to load JSON");
        
        const json = await response.json();
        console.log("Fetched JSON:", json); // Debugging

        if (!json.daily_checkouts || !Array.isArray(json.daily_checkouts)) {
          throw new Error("Invalid JSON structure");
        }

        setData(json.daily_checkouts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for chart and monthly totals
  useEffect(() => {
    if (data.length === 0) return;

    console.log("Processing data:", data); // Debugging

    const labels = [];
    const counts = [];
    const monthlyTotalsTemp = {};

    // Process each entry
    data.forEach(({ date, count }) => {
      if (!date || count === undefined) return; // Ensure valid data

      // Extract month-year
      const [year, month] = date.split("-");
      const monthKey = `${year}-${month}`;

      // Update monthly totals
      monthlyTotalsTemp[monthKey] = (monthlyTotalsTemp[monthKey] || 0) + count;

      labels.push(date);
      counts.push(count);
    });

    // Update states
    setChartData({
      labels,
      datasets: [
        {
          label: "Daily Checkouts",
          data: counts,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    });

    setMonthlyTotals(monthlyTotalsTemp);
  }, [data]);

  // Show loading message
  if (loading) {
    return <div>Loading data...</div>;
  }

  // Show error message if data is empty
  if (!chartData) {
    return <div>No chart data available. Please check the JSON file.</div>;
  }

  return (
    <div>
      <h2>Checkout Trends</h2>
      <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: "Daily Checkout Counts" } } }} />
      <h3>Total Checkouts Per Month</h3>
<table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "50%", textAlign: "center" }}>
  <thead>
    <tr>
      <th>Month</th>
      <th>Total Checkouts</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(monthlyTotals).map(([month, total]) => (
      <tr key={month}>
        <td>{month}</td>
        <td>{total}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default CheckoutChart;