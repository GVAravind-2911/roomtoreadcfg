import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/books/monthly-trends');
        processData(response.data.monthly_trends);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (data) => {
    // Extract months and genres
    const months = [...new Set(data.map((item) => item.month))];
    const genres = [...new Set(data.map((item) => item.book__genre))];

    // Generate random colors for each genre
    const genreColors = {};
    genres.forEach((genre) => {
      genreColors[genre] = getRandomColor();
    });

    // Create a dataset for each genre
    const datasets = genres.map((genre) => {
      const genreCounts = months.map((month) => {
        const monthData = data.find(
          (item) => item.month === month && item.book__genre === genre
        );
        return monthData ? monthData.count : 0;
      });

      return {
        label: genre,
        data: genreCounts,
        backgroundColor: genreColors[genre],
      };
    });

    setChartData({
      labels: months,
      datasets: datasets,
    });
  };

  // Function to generate a random RGBA color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Checkout Trends by Genre',
        font: {
          size: 16,
          family: 'Poppins, sans-serif',
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => {
            const genre = context.dataset.label;
            const count = context.raw;
            return `${genre}: ${count} checkouts`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Checkouts'
        }
      }
    }
  };

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

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl h-[400px]">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p className="text-gray-500 text-center">No data available</p>
        )}
      </div>
    </div>
  );
};

export default StackedBarChart;