'use client';

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GenreChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Formated data.json");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        if (jsonData.genre_popularity) {
          setData(jsonData.genre_popularity);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      Error: {error}
    </div>
  );

  if (data.length === 0) return (
    <div className="text-gray-500 text-center p-4">
      No genre data available
    </div>
  );

  const sortedData = [...data].sort((a, b) => b.total_checkouts - a.total_checkouts);
  const topGenres = sortedData.slice(0, 3);

  const allGenresChartData = {
    labels: sortedData.map((item) => item.book__genre),
    datasets: [{
      label: "Total Checkouts",
      data: sortedData.map((item) => item.total_checkouts),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Genre Popularity Chart',
        font: { size: 16 }
      },
    },
    scales: {
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
    <div className="w-4/5 mx-auto text-center p-4">
      <h2 className="text-2xl font-bold mb-6">Genre Popularity</h2>
      <div className="mb-8">
        <Bar data={allGenresChartData} options={chartOptions} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Top 3 Popular Genres</h3>
        <ul className="space-y-3">
          {topGenres.map((genre, index) => (
            <li key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="font-medium">
                {index + 1}. {genre.book__genre}
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">
                {genre.total_checkouts} checkouts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreChart;