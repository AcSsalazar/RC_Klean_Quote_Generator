
import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";


const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to RCKlean Quote Generator Tool</h1>
      </header>

      {/* Fondo con <img> */}
      <main className="homepage-main no-bg">
        <img
          src="/img/1.jpg"
          alt="Background"
          className="homepage-background"
          loading="lazy"
          aria-hidden="true"
        />

        <section className="homepage-options">
          <Link to="/user-info-form" className="option-card" data-gif="quote">
            <h2>Quote Calculator</h2>
            <p>Get an instant estimate for your cleaning service needs.</p>
            <button className="option-button">Start Now</button>
          </Link>

          <Link to="/quote-searcher" className="option-card" data-gif="search">
            <h2>Search Your Quote</h2>
            <p>Find your previously generated quote by Quote ID.</p>
            <button className="option-button">Search Now</button>
          </Link>

          <Link to="/about-service" className="option-card" data-gif="about">
            <h2>About Our Service</h2>
            <p>Learn more about how our tool helps you.</p>
            <button className="option-button">Learn More</button>
          </Link>
        </section>
      </main>

      <footer className="homepage-footer">
        <h3>Floors to Ceiling, We&apos;ve Got You Covered</h3>
      </footer>
    </div>
  );
};

export default HomePage;
