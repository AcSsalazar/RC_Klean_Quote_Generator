import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InvoiceCalculator from "../components/InvoiceCalculator";
import Dashboard from "../components/Dashboard";
import Login from "../components/auth/Login";
import Logout from "../components/auth/Logout";
import Register from "../components/auth/Register";
import RCFooter from "../components/base/RCFooter";
import ForgotPassword from "../components/auth/ForgotPassword";
import CreatePassword from "../components/auth/CreatePassword";

import RCHeader from "../components/base/RCHeader";
import StartForm from "../components/StartForm";
const App = () => {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <RCHeader/>
      <Routes>

        {/* Auth Routes */}

        <Route path="/login" element={<Login />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/create-new-password" element={<CreatePassword />}></Route>
        <Route path="/register" element={<Register />}></Route>

        {/* Renderiza InvoiceCalculator solo en la ruta raíz */}
        <Route path="/" element={<InvoiceCalculator />} />
        <Route path="/dashboard" element={<Dashboard />}> </Route>
        <Route path="/start-form" element={<StartForm/>}> </Route>
        
        {/* Si hay otras rutas, agrégalas aquí */}
        </Routes>
      <RCFooter/>
      </BrowserRouter>
    

  );
};

export default App;
