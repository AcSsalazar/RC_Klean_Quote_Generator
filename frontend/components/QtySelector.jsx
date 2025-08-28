// Componente para seleccionar cantidad de items con clic
import React, { useState } from "react";
import "../styles/QtySelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function QtySelector({
  initial = 1,
  min = 1,
  max = 15,
  onChange,
}) {
  const [count, setCount] = useState(initial);
  const dec = () => {
    if (count > min) {
      const next = count - 1;
      setCount(next);
      onChange?.(next);
    }
  };

  const inc = () => {
    if (count < max) {
      const next = count + 1;
      setCount(next);
      onChange?.(next);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        className="quantity-btn-dec"
        onClick={dec}
        disabled={count <= min}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <span className="quantity-value">{count}</span>
      <button
        className="quantity-btn-inc"
        onClick={inc}
        disabled={count >= max}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
