import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register the necessary chart.js components (Legend removed)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetching data from the JSON file
    fetch('/Formated data.json')
      .then((response) => response.json())
      .then((data) => processData(data.monthly_trends));
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
        const monthData = data.filter((item) => item.month === month && item.book__genre === genre);
        return monthData.length > 0 ? monthData[0].count : 0;
      });

      return {
        label: genre,
        data: genreCounts,
        backgroundColor: genreColors[genre], // Random color for each genre
      };
    });

    // Setting chart data
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
    plugins: {
      legend: {
        display: false, // Legend removed
      },
      tooltip: {
        callbacks: {
          // Customize the tooltip to display genre name and count
          title: (tooltipItem) => {
            const genre = tooltipItem[0].dataset.label;
            const count = tooltipItem[0].raw;
            return `${genre}: ${count}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default StackedBarChart;



























/*import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetching data from the JSON file
    fetch('/Formated data.json')
      .then((response) => response.json())
      .then((data) => processData(data.monthly_trends));
  }, []);

  const processData = (data) => {
    // Extract months and genres
    const months = [...new Set(data.map((item) => item.month))];
    const genres = [...new Set(data.map((item) => item.book__genre))];

    // Create a dataset for each genre
    const datasets = genres.map((genre) => {
      const genreCounts = months.map((month) => {
        const monthData = data.filter((item) => item.month === month && item.book__genre === genre);
        return monthData.length > 0 ? monthData[0].count : 0;
      });

      return {
        label: genre,
        data: genreCounts,
        backgroundColor: getGenreColor(genre), // Custom color for each genre
      };
    });

    // Setting chart data
    setChartData({
      labels: months,
      datasets: datasets,
    });
  };

  const getGenreColor = (genre) => {
    // Return a color for each genre (you can adjust these colors)
    const colors = {
      Fantasy: 'rgba(75, 192, 192, 0.6)',
      SciFi: 'rgba(153, 102, 255, 0.6)',
      Mystery: 'rgba(255, 159, 64, 0.6)',
      // Add more genres and colors as needed
    };
    return colors[genre] || 'rgba(255, 99, 132, 0.6)'; // Default color
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          // Customize the tooltip to display the genre and count
          title: (tooltipItem) => {
            const genre = tooltipItem[0].dataset.label;
            const count = tooltipItem[0].raw;
            return `${genre}: ${count}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default StackedBarChart;
*/