import {
  faBookmark,
  faCompass,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homePageNavbarStyles from "./HomePageNavbar.module.css";

export default function HomePageNavbar() {
  return (
    <nav className={homePageNavbarStyles.homeNavbar}>
      <ul className={homePageNavbarStyles.homeNavbarNavItemsContainer}>
        <li>
          <button className={homePageNavbarStyles.homeNavbarButton}>
            <span className={homePageNavbarStyles.navbarButtonIconContainer}>
              <FontAwesomeIcon icon={faUser} />
            </span>
            My Profile
          </button>
        </li>
        <li>
          <button className={homePageNavbarStyles.homeNavbarButton}>
            <span className={homePageNavbarStyles.navbarButtonIconContainer}>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            Feed
          </button>
        </li>
        <li>
          <button className={homePageNavbarStyles.homeNavbarButton}>
            <span className={homePageNavbarStyles.navbarButtonIconContainer}>
              <FontAwesomeIcon icon={faCompass} />
            </span>
            Explore
          </button>
        </li>
        <li>
          <button className={homePageNavbarStyles.homeNavbarButton}>
            <span className={homePageNavbarStyles.navbarButtonIconContainer}>
              <FontAwesomeIcon icon={faMessage} />
            </span>
            Messages
          </button>
        </li>
        <li>
          <button className={homePageNavbarStyles.homeNavbarButton}>
            <span className={homePageNavbarStyles.navbarButtonIconContainer}>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            Saved Posts
          </button>
        </li>
      </ul>
    </nav>
  );
}
