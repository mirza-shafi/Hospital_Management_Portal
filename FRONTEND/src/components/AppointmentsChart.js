import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const AppointmentsChart = ({ totalAppointments }) => {
  const data = {
    datasets: [{
      data: [totalAppointments, 100 - totalAppointments],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)', 
        'rgba(200, 200, 200, 0.8)' 
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)', 
        'rgba(200, 200, 200, 1)' 
      ],
      borderWidth: 2,
      hoverBorderWidth: 4,
      hoverBorderColor: '#333', 
      borderRadius: 5, 
    }],
    labels: ['Appointments', 'Remaining']
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true, 
        backgroundColor: '#333', 
        titleColor: '#fff',
        bodyColor: '#fff', 
        borderColor: '#ddd', 
        borderWidth: 1,
      },
      datalabels: {
        display: true,
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
        color: '#fff', 
        font: {
          weight: 'bold',
          size: 14, 
        },
        anchor: 'center',
        align: 'center',
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800, 
      easing: 'easeInOutQuad',
    },
    layout: {
      padding: {
        top: 10, 
        bottom: 10,
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default AppointmentsChart;
