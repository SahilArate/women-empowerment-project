import React, { useState } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="dashboard-container">

      <div className={open ? "sidebar open" : "sidebar closed"}>

        <div className="toggle-btn" onClick={() => setOpen(!open)}>
          ☰
        </div>

        <h2 className="sidebar-title">Services</h2>

        <ul>
          <li>
            <a href="/health">Health</a>
          </li>
          <li>Education</li>
          <li>Safety</li>
          <li>Mental Well Being</li>
          <li>Financial Independence</li>
        </ul>

      </div>

      <div className="main-content">
        <h1>Welcome to Women Empowerment Portal</h1>
        <p>
          Select any service from the left menu to explore the features.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;