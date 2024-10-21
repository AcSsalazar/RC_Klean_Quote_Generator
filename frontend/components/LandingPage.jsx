// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <h1>Bienvenido a Nuestro Servicio</h1>
      <Link to="/register">Obtener una Cotización</Link>
      <br />
      <Link to="/login">Iniciar Sesión</Link>
    </div>
  );
}

export default LandingPage;
