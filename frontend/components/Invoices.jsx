// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Invoices() {



  return (
    <div>
      <h1>Invoice visualizator: </h1>
      <Link to="/">Obtener una Cotización</Link>
      <br />
      <Link to="/login">Iniciar Sesión</Link>
    </div>
  );
}

export default Invoices;
