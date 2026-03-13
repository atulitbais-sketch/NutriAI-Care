import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function HealthTrendChart({ title, labels, values, unit }) {
  const data = {
    labels,
    datasets: [
      {
        label: `${title} (${unit})`,
        data: values,
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="card chart-card">
      <div className="card-header">
        <div className="card-icon-wrapper blue">📉</div>
        <h2>{title}</h2>
      </div>
      <div className="card-content">
        <div className="chart-wrapper">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default HealthTrendChart;