// src/components/Dashboard.jsx

import React, { useEffect, useState } from "react";
import api from "../src/utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // Importamos los estilos específicos del dashboard

function Dashboard() {
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const headers = {
        Authorization: `Token ${token}`,
      };
      api
        .get("/api/businesses/", { headers })
        .then((response) => {
          setBusinessInfo(response.data[0]); // Asumiendo un negocio por usuario
        })
        .catch((error) => {
          alert("Error al obtener la información del negocio");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!businessInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1 className="logo">Mi Negocio</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </nav>
      <main className="dashboard-main">
        <section className="business-info">
          <h2>Información del Negocio</h2>
          <div className="info-grid">
            <div>
              <strong>Nombre:</strong>
              <p>{businessInfo.business_name}</p>
            </div>
            <div>
              <strong>Industria:</strong>
              <p>{businessInfo.industry.replace(/_/g, " ")}</p>
            </div>
            <div>
              <strong>Dirección:</strong>
              <p>{businessInfo.address}</p>
            </div>
            <div>
              <strong>Teléfono:</strong>
              <p>{businessInfo.phone_number}</p>
            </div>
            <div>
              <strong>Contacto Celular:</strong>
              <p>{businessInfo.contact_cell}</p>
            </div>
            <div>
              <strong>Contacto Trabajo:</strong>
              <p>{businessInfo.contact_work_number}</p>
            </div>
          </div>
        </section>
        <section className="service-summary">
          <h2>Resumen de Servicios</h2>
          {/* Aquí puedes agregar componentes o información adicional relacionada con los servicios */}
          <p>Aquí encontrarás el resumen de tus servicios y cotizaciones.</p>
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>
          &copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
