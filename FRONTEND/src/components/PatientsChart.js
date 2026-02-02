import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const PatientsChart = ({ totalPatients }) => {
  const data = {
    labels: ['Active Patients'],
    datasets: [
      {
        label: 'Current Total',
        data: [totalPatients],
        backgroundColor: [
          'rgba(67, 233, 123, 0.7)',
        ],
        borderColor: [
          'rgba(67, 233, 123, 1)',
        ],
        borderWidth: 2,
        borderRadius: 12,
        barThickness: 120,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          stepSize: 1,
          color: '#94a3b8',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { weight: 'bold' }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="patients-chart-wrapper" style={{ width: '100%', height: '400px', padding: '10px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PatientsChart;
