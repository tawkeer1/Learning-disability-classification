"use client";

import { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModelComparisonChart() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
  try {
    const res = await fetch("/api/metrics");
    const data = await res.json();
    console.log("Fetched metrics data:", data);

    if (Array.isArray(data)) {
      setMetrics(data);
    } else {
      throw new Error("Invalid metrics format");
    }
  } catch (err) {
    console.error("Failed to load metrics:", err);
    setError("Failed to load metrics");
  } finally {
    setLoading(false);
  }
};

    fetchMetrics();
  }, []);

  if (loading) return <p className="text-white">Loading model metrics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!Array.isArray(metrics) || metrics.length === 0) {
    return <p className="text-white">No metrics available to display.</p>;
  }

  const chartData = {
    labels: metrics.map((item) => item.Model),
    datasets: [
      {
        label: "F1 Score",
        data: metrics.map((item) => parseFloat(item["F1 Score"])),
        backgroundColor: "#60a5fa",
      },
      {
        label: "Accuracy",
        data: metrics.map((item) => parseFloat(item.Accuracy)),
        backgroundColor: "#34d399",
      },
      {
        label: "Precision",
        data: metrics.map((item) => parseFloat(item.Precision)),
        backgroundColor: "#fbbf24",
      },
      {
        label: "Recall",
        data: metrics.map((item) => parseFloat(item.Recall)),
        backgroundColor: "#f87171",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "white" } },
      title: {
        display: true,
        text: "📊 Model Performance Comparison",
        color: "white",
      },
    },
    scales: {
      y: {
        ticks: { color: "white" },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div className="bg-gray-700 p-6 rounded shadow text-white mt-6">
      <h2 className="text-2xl font-semibold mb-4">📈 Model Comparison</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
