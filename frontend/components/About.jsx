// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import "../styles/About.css";

const AboutService = () => {
  return (
    <div className="about-service-container">
      <div className="text-container">
      <h1>About Our Service</h1>
      <p className="description">
        Welcome to the RC Klean Quote Tool, your one-stop solution for generating instant cleaning service estimates. Whether you run a restaurant, office, or commercial space, our tool helps you calculate costs tailored to your specific needs. Simply provide your business type, area details, and equipment requirements, and we’ll deliver a detailed quote in seconds. With features like quote searching and PDF downloads, we make it easy to plan your cleaning services efficiently. At RC Klean, we’re committed to keeping your space spotless from floors to ceiling—because we’ve got you covered!
      </p>
      <Link to="/" className="back-link">Back to Home</Link>
      </div>
    </div>
  );
};

export default AboutService;