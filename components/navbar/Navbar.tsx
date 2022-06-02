import navbarStyles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logo/Logo";

export function MacroNavbar() {
  return (
    <nav className={navbarStyles.navbar}>
      <Logo />
      <div>
        <input
          className={navbarStyles.searchBar}
          placeholder="Search users..."
        />
      </div>
      <ul className={navbarStyles.buttonContainer}>
        <li>
          <button title="Notifications">
            <FontAwesomeIcon icon={faBell} />
          </button>
        </li>
        <li>
          <button title="Messages">
            <FontAwesomeIcon icon={faMessage} />
          </button>
        </li>
        <li>
          <button title="Settings">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
