import {
  faBookmark,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import miniNavbarStyles from "./MiniPageNavbar.module.css";

export default function MiniPageNavbar() {
  return (
    <nav className={miniNavbarStyles.mobileNavbar}>
      <div className={miniNavbarStyles.followBar}></div>
      <ul className={miniNavbarStyles.navItemsContainer}>
        <li className={miniNavbarStyles.navItem}>
          <Link href="/save">
            <button className={miniNavbarStyles.navButton}>
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </Link>
        </li>
        <li className={miniNavbarStyles.navItem}>
          <Link href="/chat">
            <button className={miniNavbarStyles.navButton}>
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </Link>
        </li>
        <li className={miniNavbarStyles.navItem}>
          <Link href="/feed">
            <button className={miniNavbarStyles.navButton}>
              <FontAwesomeIcon icon={faHome} />
            </button>
          </Link>
        </li>
        <li className={miniNavbarStyles.navItem}>
          <Link href="/profile">
            <button className={miniNavbarStyles.navButton}>
              <FontAwesomeIcon icon={faUser} />
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
