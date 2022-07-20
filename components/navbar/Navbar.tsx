import navbarStyles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logo/Logo";
import { useAuth } from "../../contexts/AuthContext";

export function MacroNavbar() {
  const { status, logout } = useAuth();
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
          <button title="Settings">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </li>
        {status === "authenticated" && (
          <li>
            <button title="Log out" onClick={() => logout()}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
