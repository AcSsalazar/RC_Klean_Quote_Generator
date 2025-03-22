import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import logo from "../public/img/foot-logo_1.png"; // Assuming you want to reuse your logo

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src={logo} alt="RC Klean Logo" className="homepage-logo" />
        <h1>Welcome to RC Klean Quote Tool</h1>
        <p>"Floors to Ceiling, We’ve Got You Covered"</p>
      </header>

      <main className="homepage-main">
        <section className="homepage-options">
          <Link to="/user-info-form" className="option-card">
            <h2>Quote Calculator</h2>
            <p>Get an instant estimate for your cleaning service needs.</p>
            <button className="option-button">Start Now</button>
          </Link>

          <Link to="/quote-searcher" className="option-card">
            <h2>Search Your Quote</h2>
            <p>Find your previously generated quote by Quote ID.</p>
            <button className="option-button">Search Now</button>
          </Link>

          <Link to="/about-service" className="option-card">
            <h2>About Our Service</h2>
            <p>Learn more about how our tool helps you.</p>
            <button className="option-button">Learn More</button>
          </Link>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2025 RC Klean. All rights reserved.</p>
        <p>
          Powered by <a href="https://wirkconsulting.com/">Wirk Consulting</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;