import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Graph() {
  const [chartData, setChartData] = useState(null);
  const [totalCheckouts, setTotalCheckouts] = useState(0);
  const [graphType, setGraphType] = useState('Doughnut');

  useEffect(() => {
    fetch('/Formated data.json')
      .then((response) => response.json())
      .then((data) => {
        const genreCheckouts = data.genre_checkouts;

        // Aggregate genre checkout data
        const aggregatedData = genreCheckouts.reduce((acc, item) => {
          acc[item.book__genre] = item.checkout_count;
          return acc;
        }, {});

        // Calculate total checkouts
        const total = Object.values(aggregatedData).reduce((sum, val) => sum + val, 0);
        setTotalCheckouts(total);

        // Prepare chart dataset
        const chartDataset = {
          labels: Object.keys(aggregatedData),
          datasets: [
            {
              data: Object.values(aggregatedData),
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(99, 132, 255)',
                'rgb(199, 199, 199)',
                'rgb(255, 87, 51)',
                'rgb(120, 46, 139)'
              ],
              hoverOffset: 4,
              borderRadius: 30,
              spacing: 10,
            },
          ],
        };

        setChartData(chartDataset);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: true,
        labels: {
          font: {
            family: 'Poppins, sans-serif',
          },
        },
      },
    },
  };

  const renderGraph = () => {
    switch (graphType) {
      case 'Doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'Pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'Bar':
        return (
          <Bar
            data={chartData}
            options={{
              indexAxis: 'y',
              scales: {
                x: { beginAtZero: true },
              },
              ...chartOptions,
            }}
          />
        );
      default:
        return <Doughnut data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
      <div className="chart bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border-4 border-lightBlue-500 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Genre Checkout Statistics</h2>
        <div className="mb-4">
          <select
            className="p-3 border-2 border-lightBlue-500 rounded-md bg-gray-200 text-gray-700 font-semibold font-poppins focus:outline-none focus:ring-2 focus:ring-lightBlue-300 hover:bg-gray-300 cursor-pointer transition duration-200"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
          >
            <option value="Doughnut">Doughnut</option>
            <option value="Pie">Pie</option>
            <option value="Bar">Bar</option>
          </select>
        </div>
        {chartData && renderGraph()}
        <h3 className="title mt-4 mb-4 font-bold text-xl text-gray-800 font-poppins">
          Total Checkouts:
          <span className="block text-2xl text-emerald-500 mt-2 font-semibold">
            {totalCheckouts}
          </span>
        </h3>
      </div>
    </div>
  );
}










































/*import { ArcElement, BarElement, CategoryScale, Chart, LinearScale, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Graph() {
  const [chartData, setChartData] = useState(null);
  const [totalCheckouts, setTotalCheckouts] = useState(0);
  const [graphType, setGraphType] = useState('Doughnut');

  useEffect(() => {
    fetch('/Formated data.json')
      .then((response) => response.json())
      .then((data) => {
        const genreCheckouts = data.genre_checkouts;

        // Aggregate genre checkout data
        const aggregatedData = genreCheckouts.reduce((acc, item) => {
          acc[item.book__genre] = item.checkout_count;
          return acc;
        }, {});

        // Calculate total checkouts
        const total = Object.values(aggregatedData).reduce((sum, val) => sum + val, 0);
        setTotalCheckouts(total);

        // Prepare chart dataset
        const chartDataset = {
          labels: Object.keys(aggregatedData),
          datasets: [
            {
              data: Object.values(aggregatedData),
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(99, 132, 255)',
                'rgb(199, 199, 199)',
                'rgb(255, 87, 51)',
                'rgb(120, 46, 139)'
              ],
              hoverOffset: 4,
              borderRadius: 30,
              spacing: 10,
            },
          ],
        };

        setChartData(chartDataset);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
        labels: {
          font: {
            family: 'Poppins, sans-serif',
          },
        },
      },
    },
  };

  const renderGraph = () => {
    switch (graphType) {
      case 'Doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'Pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'Bar':
        return (
          <Bar
            data={chartData}
            options={{
              indexAxis: 'y',
              scales: {
                x: { beginAtZero: true },
              },
              ...chartOptions,
            }}
          />
        );
      default:
        return <Doughnut data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
      <div className="chart bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
        <div className="mb-4">
          <select
            className="p-3 border rounded-md bg-gray-200 text-gray-700 font-semibold font-poppins"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
          >
            <option value="Doughnut">Doughnut</option>
            <option value="Pie">Pie</option>
            <option value="Bar">Bar</option>
          </select>
        </div>
        {chartData && renderGraph()}
        <h3 className="title mt-4 mb-4 font-bold text-xl text-gray-800 font-poppins">
          Total Checkouts:
          <span className="block text-2xl text-emerald-500 mt-2 font-semibold">
            {totalCheckouts}
          </span>
        </h3>
      </div>
    </div>
  );
}


*/