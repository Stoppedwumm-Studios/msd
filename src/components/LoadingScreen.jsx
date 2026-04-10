import React from 'react';
import churchLogo from '../svg/church.svg'; // Path to your SVG

const LoadingScreen = ({ isExiting }) => {
  return (
    <div className={`loading-screen ${isExiting ? 'exit' : ''}`}>
      <div className="loading-wrapper">
        <img src={churchLogo} alt="Loading..." className="loading-logo" />
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;