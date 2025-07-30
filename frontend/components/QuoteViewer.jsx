/* eslint-disable no-unused-vars */
// src/components/SavedQuotes.js
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../frontend/src/RCA/auth.js";
import apiInstance from "../../frontend/src/utils/axios.js";
import { useNavigate } from "react-router-dom";

export default function SavedQuotes() {
  const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchQuotes = async () => {
      try {
        const response = await apiInstance.get("saved-quotes/");
        setQuotes(response.data);
      } catch (err) {
        setError("Failed to load saved quotes.");
      }
    };
    fetchQuotes();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn()) return null; // Render nothing while redirecting

  return (
    <div className="saved-quotes">
      <h1>Your Saved Quotes</h1>
      {error && <p className="error">{error}</p>}
      {quotes.length === 0 ? (
        <p>No saved quotes yet.</p>
      ) : (
        <ul>
          {quotes.map((quote) => (
            <li key={quote.id}>
              <p>Invoice #{quote.id} - ${quote.total_price}</p>
              <p>Business Type: {quote.business_type.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
