import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../src/RCA/auth";
import "../../styles/header.css";
import logo from "../../public/img/foot-logo_1.png";

function RCHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // solo para dropdown "Options"

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const ToggleDropDown = () => setIsOpen(!isOpen);

  const GetUserName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  return (
    <header className="app-header">
      <div className={`header-content ${menuOpen ? "menu-open" : ""}`}>
        {/* Logo y título: no visibles al abrir el menu*/}
        <div className={`logo-section ${menuOpen ? "hider" : ""}`}>
          <img src={logo} alt="Company Logo" className="logo" />

          <Link to="/" className="header-text">
            Quote Generator
          </Link>
        </div>

        {/* Botón hamburguesa para mostrar navegación y acciones */}
        <button className="hamburger" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Contenedor para main-nav y user-actions */}
        <div className={`header-toggle-section ${menuOpen ? "open" : ""}`}>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/quote-searcher">Quote Searcher</Link>
            <Link to="/user-info-form">Generator</Link>
            <Link to="/coverage">Coverage</Link>
          </nav>

          <div className="user-actions">
            {isLoggedIn() ? (
              <>
                <span className="user-greeting">
                  Hi Dear, {GetUserName(user().full_name)}
                </span>
                <Link to="/logout" className="headerbtn">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <span className="user-greeting">Hi Dear, User</span>
                <Link to="/register" className="headerbtn">
                  Register
                </Link>
                <Link to="/login" className="headerbtn">
                  Login
                </Link>
              </>
            )}

            {/* Dropdown independiente */}
            <div className="dropdown">
              <p className="dropdown-button" onClick={ToggleDropDown}>
                Options ▼
              </p>
              {isOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/user-info-form">Quote Calculator</Link>
                  </li>
                  <li>
                    <Link to="/quote-searcher">Searcher</Link>
                  </li>
                  <li>
                    <Link to="/about-service">About the tool</Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default RCHeader;
