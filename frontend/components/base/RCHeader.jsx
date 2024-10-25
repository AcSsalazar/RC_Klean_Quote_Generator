import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";

function RCHeader() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Verifica que user esté bien definido y que tenga username antes de acceder a él
    if (user && user.username) {
      console.log(user.username);
    }
  }, [user]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            RC Klean invoice estimator
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Resto del menú */}
            </ul>
            <div className="d-flex">
              <input
                onChange={null}
                name="search"
                className="form-control me-2"
                type="text"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={null}
                className="btn btn-outline-success me-2"
                type="submit"
              >
                Search
              </button>
            </div>
            {isLoggedIn ? (
              <>
                <Link className="btn btn-primary me-2" to="/logout">
                  Salir
                </Link>
                <Link className="btn btn-primary me-2" to="/dashboard">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-primary me-2" to="/register">
                  Registrarse
                </Link>
                <Link className="btn btn-primary me-2" to="/login">
                  Iniciar sesión
                </Link>
              </>
            )}
            <Link className="btn btn-danger" to="/cart/">
              <i className="fas fa-shopping-cart"></i>{" "}
              <span id="cart-total-items">0</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default RCHeader;
