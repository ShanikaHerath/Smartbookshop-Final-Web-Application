import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <h1>Welcome to Book Shop!</h1>
        <p>Join us today and explore amazing features.</p>
        <Link to="/signup" className="btn-welcome">Get Started</Link>
      </div>
    </div>
  );
};

export default Welcome;
