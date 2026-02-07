import React from 'react';


const ECGAnimation = () => {
  return (
    <div className="ecg-animation">
      <svg viewBox="0 0 500 100" width="100%" height="50">
        <polyline
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          points="0,50 50,50 70,20 90,80 110,50 150,50 170,90 190,10 210,50 250,50 290,50 310,20 330,80 350,50 400,50 450,50"
        />
      </svg>
    </div>
  );
};

export default ECGAnimation;
