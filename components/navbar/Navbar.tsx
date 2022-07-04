import navbarStyles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logo/Logo";
import { signOut, useSession } from "next-auth/react";

export function MacroNavbar() {
  const { data: session } = useSession();
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
        {session && (
          <li>
            <button
              title="Log out"
              onClick={() => signOut({ redirect: false })}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
