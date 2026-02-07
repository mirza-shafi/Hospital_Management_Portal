import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AppointmentsChart = ({ totalAppointments }) => {
  // Logic for the chart: If 0, show a faint placeholder
  const displayValue = totalAppointments || 0;
  const targetValue = Math.max(displayValue * 1.5, 10); // Dynamic target or min of 10
  const remaining = Math.max(targetValue - displayValue, 0);

  const data = {
    labels: ['Completed', 'Upcoming'],
    datasets: [{
      data: [displayValue, remaining],
      backgroundColor: [
        '#6366f1', // Indigo 500
        '#f1f5f9'  // Slate 100 
      ],
      hoverBackgroundColor: [
        '#4f46e5', // Indigo 600
        '#f8fafc'  // Slate 50
      ],
      borderWidth: 0,
      circumference: 360,
      rotation: 0,
      cutout: '80%',
      borderRadius: displayValue > 0 ? 10 : 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1e293b',
        titleFont: { size: 14, weight: '700' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      
      // Draw Total Number
      ctx.font = 'bold 2.5rem Inter, sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayValue, width / 2, height / 2 - 5);

      // Draw Subtitle
      ctx.font = '500 0.85rem Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('APPOINTMENTS', width / 2, height / 2 + 25);
      
      ctx.restore();
    },
  };

  return (
    <div className="analytics-chart-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Doughnut 
        data={data} 
        options={options} 
        plugins={[centerTextPlugin]}
      />
    </div>
  );
};

export default AppointmentsChart;
