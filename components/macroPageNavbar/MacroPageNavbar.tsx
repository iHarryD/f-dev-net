import {
  faBookmark,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import macroPageNavbarStyles from "./MacroPageNavbar.module.css";

export default function MacroPageNavbar() {
  return (
    <nav className={macroPageNavbarStyles.homeNavbar}>
      <ul className={macroPageNavbarStyles.homeNavbarNavItemsContainer}>
        <li>
          <Link href="/profile">
            <div className={macroPageNavbarStyles.homeNavbarLink}>
              <span className={macroPageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span>My Profile</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/">
            <div className={macroPageNavbarStyles.homeNavbarLink}>
              <span className={macroPageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faHome} />
              </span>
              <span>Feed</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/chat">
            <div className={macroPageNavbarStyles.homeNavbarLink}>
              <span className={macroPageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faMessage} />
              </span>
              <span>Chats</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/saved">
            <div className={macroPageNavbarStyles.homeNavbarLink}>
              <span className={macroPageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faBookmark} />
              </span>
              <span>Saved Posts</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
