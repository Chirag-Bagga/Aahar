import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import "./header.css";

export default function Header() {
  return (
    <header className="site-header" data-translate="message">
      <nav className="site-nav" aria-label="Primary navigation">
        <ul className="site-nav__list">
          <li>
            <img src={Logo} alt="Aahar logo" className="site-nav__logo" />
          </li>
          <li>
            <Link className="site-nav__link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="site-nav__link" to="/marketplace">
              Marketplace
            </Link>
          </li>
          <li>
            <Link className="site-nav__link" to="/disease">
              Disease
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
