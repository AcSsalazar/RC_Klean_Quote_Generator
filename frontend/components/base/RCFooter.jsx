import { Link } from "react-router-dom";
import "../../styles/footer.css";

function RCFooter() {
  return (
    <footer className="rc-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>RC Klean</h3>
          <p>
            Floors to Ceiling, We&apos;ve Got You Covered. Professional cleaning
            services for restaurants and commercial spaces.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com/rcklean"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com/rcklean"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com/company/rcklean"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about-service">About this tool</Link>
            </li>
            <li>
              <Link to="https://rcklean.com/commercial-restaurant-cleaning/">
                Services
              </Link>
            </li>
            <li>
              <Link to="/user-info-form/">Get a Quote</Link>
            </li>
            <li>
              <Link to="https://rcklean.com/contact-us/">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <a href="mailto:rcklean@rcklean.com">rcklean@rcklean.com</a>
            </li>
            <li>
              <a href="tel:+12128787611">212-878-7611</a>
            </li>
            <li>New York, NY</li>
            <li>
              <Link to="https://rcklean.com/our-work/">Our Work</Link>
            </li>
            <li>
              <Link to="https://rcklean.com/our-clients/">Our Clients</Link>
            </li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>
            Powered by{" "}
            <a
              href="https://wirkconsulting.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wirk Consulting SAS
            </a>
          </p>
          <p>© {new Date().getFullYear()} RC Klean. All rights reserved.</p>
          <a className="credits-links">
            Icons by Lordicon.com & Images by Freepik.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default RCFooter;
