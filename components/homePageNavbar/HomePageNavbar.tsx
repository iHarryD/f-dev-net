import {
  faBookmark,
  faCompass,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import homePageNavbarStyles from "./HomePageNavbar.module.css";

export default function HomePageNavbar() {
  return (
    <nav className={homePageNavbarStyles.homeNavbar}>
      <ul className={homePageNavbarStyles.homeNavbarNavItemsContainer}>
        <li>
          <Link href="/profile">
            <div className={homePageNavbarStyles.homeNavbarLink}>
              <span className={homePageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span>My Profile</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/">
            <div className={homePageNavbarStyles.homeNavbarLink}>
              <span className={homePageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faBookmark} />
              </span>
              <span>Feed</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/explore">
            <div className={homePageNavbarStyles.homeNavbarLink}>
              <span className={homePageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faCompass} />
              </span>
              <span>Explore</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/chat">
            <div className={homePageNavbarStyles.homeNavbarLink}>
              <span className={homePageNavbarStyles.navbarLinkIconContainer}>
                <FontAwesomeIcon icon={faMessage} />
              </span>
              <span>Chats</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/saved">
            <div className={homePageNavbarStyles.homeNavbarLink}>
              <span className={homePageNavbarStyles.navbarLinkIconContainer}>
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
