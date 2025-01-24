// ProgressCard.js
import React from "react";
import "../assets/css/homeDashboard.css";

const ProgressCard = ({ title, progressPercentage, description }) => (
  <div className="progress-card">
    <h4>{title}</h4>
    <p>{description}</p>
    <div className="goal-progress-bar">
      <div style={{ width: progressPercentage }}></div>
    </div>
    <span>{progressPercentage}</span>
  </div>
);

export default ProgressCard;
