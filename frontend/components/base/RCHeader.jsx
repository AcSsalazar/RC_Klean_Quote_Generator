import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from "../../src/RCA/auth";
import '../../styles/header.css';
import logo from "../../public/img/foot-logo_1.png";
export default function RCHeader() {
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user
  ]);

  return (
    <header className="app-header">
      <div className="header-content">
      <img src={logo} alt="Company Logo" style={{ height: '50px', marginRight: '10px' }} />
        <Link to="/" className="logo">RC Klean Invoice Estimator</Link>
        
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/invoices">Invoices</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/reports">Reports</Link>
        </nav>

        <div className="user-actions">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">Hello, {user().username}</span>
              <Link to="/dashboard" className="nav-button">Dashboard</Link>
              <Link to="/logout" className="nav-button">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="nav-button">Register</Link>
              <Link to="/login" className="nav-button">Login</Link>
            </>
          )}
          <Link to="/cart" className="cart-button">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-items">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}