import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

export default function Header(){
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-evenly space-x-4 p-5">
          <li>
            {/* use Tailwind or inline style for border reset */}
            <img src={Logo} alt="Aahar logo" className="h-16" /* style={{ border: 0 }} */ />
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/marketplace">MarketPlace</Link>
          </li>
          <li>
            <Link to="/disease">Disease</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
