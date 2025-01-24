import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../assets/css/dashboard.css";

const Dashboard = () => (
  <div className="dashboard-container-main-wrapper ">
    <Sidebar />
    <div className="dashboard-main-content">
      <Navbar />
      <main>
        <section className="dashboard-section-content">
          {/* Dynamically render the selected route */}
          <Outlet />
        </section>
      </main>
    </div>
  </div>
);

export default Dashboard;
