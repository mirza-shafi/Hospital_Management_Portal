import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const PatientsChart = ({ totalPatients }) => {
  const data = {
    labels: ['Patients'],
    datasets: [
      {
        label: 'Total Patients',
        data: [totalPatients],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="patients-chart">
      <Bar data={data} />
    </div>
  );
};

export default PatientsChart;
