import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InvoiceCalculator from "../components/InvoiceCalculator";
import Dashboard from "../components/Dashboard";
import RCFooter from "../components/base/RCFooter";
import RCHeader from "../components/base/RCHeader";
const App = () => {
  return (
    <BrowserRouter>
      <RCHeader/>
      <Routes>
        {/* Renderiza InvoiceCalculator solo en la ruta raíz */}
        <Route path="/" element={<InvoiceCalculator />} />
        <Route path="/dashboard" element={<Dashboard />}> </Route>
        

        {/* Si hay otras rutas, agrégalas aquí */}
      </Routes>
      <RCFooter/>
      </BrowserRouter>
    

  );
};

export default App;
