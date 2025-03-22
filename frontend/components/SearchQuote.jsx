import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiInstance from "../src/utils/axios";
import "../styles/QuoteSearch.css";

const SearchQuote = () => {
  const [quoteId, setQuoteId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!quoteId || quoteId.length !== 5) {
      setError("Please enter a valid 5-character Quote ID (e.g., ABC45).");
      return;
    }

    try {
      await apiInstance.get(`/invoice/${quoteId}/`);  // Check if quote exists
      navigate(`/results/${quoteId}`);
    } catch (error) {
      console.error("Error searching quote:", error);
      setError("Quote not found. Please check your Quote ID and try again.");
    }
  };

  return (
    <div className="search-quote-container">
      <h1>Search Your Quote</h1>
      <p>Enter your Quote ID to view your estimate.</p>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={quoteId}
          onChange={(e) => setQuoteId(e.target.value.toUpperCase())}
          placeholder="Enter Quote ID (e.g., ABC45)"
          maxLength={5}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Link to="/" className="back-link">Back to Home</Link>
    </div>
  );
};

export default SearchQuote;