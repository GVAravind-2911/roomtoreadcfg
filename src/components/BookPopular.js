import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GenreChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("./Formated data.json") // Fetch from public folder
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.genre_popularity) {
          setData(jsonData.genre_popularity);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (data.length === 0) return <p>No data available</p>;

  // Sort by total_checkouts (Descending)
  const sortedData = [...data].sort((a, b) => b.total_checkouts - a.total_checkouts);
  const topGenres = sortedData.slice(0, 3); // Top 3 genres

  // Chart data for all genres
  const allGenresChartData = {
    labels: sortedData.map((item) => item.book__genre),
    datasets: [
      {
        label: "Total Checkouts",
        data: sortedData.map((item) => item.total_checkouts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>Genre Popularity</h2>
      <Bar data={allGenresChartData} options={{ responsive: true }} />

      {/* Top 3 Genres as Text */}
      <h3 style={{ marginTop: "20px" }}>Top 3 Popular Genres</h3>
      <ul style={{ listStyleType: "none", padding: 0, fontSize: "18px", fontWeight: "bold" }}>
        {topGenres.map((genre, index) => (
          <li key={index}>
            {index + 1}. {genre.book__genre} - {genre.total_checkouts} checkouts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreChart;
