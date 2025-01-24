import React from 'react';
import '../assets/css/NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link  to="/" className="back-home-btn">Go Back Home</Link>
    </div>
  );
}

export default NotFound;
