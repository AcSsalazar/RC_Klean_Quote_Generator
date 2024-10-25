import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">

      <main className="dashboard-main">
        <h1>Welcome to Your Invoice Management System</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Invoices</h3>
            <p>254</p>
          </div>
          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p>$12,543</p>
          </div>
          <div className="stat-card">
            <h3>This Months Revenue</h3>
            <p>$45,678</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link to="/create-invoice" className="dashboard-button">Create New Invoice</Link>
          <Link to="/invoices" className="dashboard-button">View All Invoices</Link>
        </div>
        <div className="dashboard-nav">
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/register" className="nav-button">Register</Link>
          <Link to="/" className="nav-button">Home</Link>
        </div>
      </main>

    </div>
  );
}

export default Dashboard;