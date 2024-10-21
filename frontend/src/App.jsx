import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InvoiceCalculator from "../components/InvoiceCalculator";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Renderiza InvoiceCalculator solo en la ruta raíz */}
        <Route path="/" element={<InvoiceCalculator />} />
        {/* Si hay otras rutas, agrégalas aquí */}
      </Routes>
    </Router>
  );
};

export default App;
