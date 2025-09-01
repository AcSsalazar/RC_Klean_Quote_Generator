import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-container">
        <h1 className="not-found-404">
          4
          <span>
            <img src="/img/faviconlogo.png" alt="0" className="icon-web" />
          </span>
          4
        </h1>

        {/* Mensaje */}
        <div className="not-found-text">
          <h2>Ups!</h2>
          <p className="disclaimer">
            This page is not avalible or just doesn&apos;t exist{" "}
          </p>
          <div className="not-found-links">
            <Link to="/" className="btn-home">
              Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
