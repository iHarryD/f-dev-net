import navbarStyles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faClose,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../logo/Logo";
import { useEffect, useState } from "react";
import { findUsers } from "../../services/profileServices";
import { useRouter } from "next/router";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logout } from "../../features/userSlice";
import { UserAuthStatus } from "../../interfaces/Common.interface";

export function MacroNavbar() {
  const { status, user } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch<AppDispatch>();
  const [searchResults, setSearchResults] = useState<
    {
      image: string;
      name: string;
      username: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedValue.replaceAll(" ", "").length === 0) {
      setSearchResults([]);
      return;
    }
    findUsers(debouncedValue, setIsLoading, (result) =>
      setSearchResults(result.data.data)
    );
  }, [debouncedValue]);

  return (
    <nav className={navbarStyles.navbar}>
      <Logo />
      <div className={navbarStyles.searchBarAndResultsContainer}>
        <input
          value={searchQuery}
          placeholder="Search users..."
          className={navbarStyles.searchBar}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className={navbarStyles.closeButton}
          onClick={() => setSearchQuery("")}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        {isLoading && (
          <div className={navbarStyles.infoTextContainer}>Loading...</div>
        )}
        {searchResults.length > 0 && (
          <ul className={navbarStyles.searchResultsContainer}>
            {searchResults.map((user) => (
              <li>
                <button
                  className={navbarStyles.searchResult}
                  onClick={() => {
                    {
                      router.push(`/profile?username=${user.username}`);
                      setSearchResults([]);
                    }
                  }}
                >
                  <div>
                    <img
                      src={user.image}
                      alt={user.username}
                      className={navbarStyles.profilePicturePreview}
                    />
                  </div>
                  <div className={navbarStyles.nameUsernameContainer}>
                    <span>{user.name}</span>
                    <span className={navbarStyles.username}>
                      @{user.username}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ul className={navbarStyles.buttonContainer}>
        <li>
          <button
            title="Notifications"
            onClick={() => {
              console.log(user);
            }}
          >
            <FontAwesomeIcon icon={faBell} />
          </button>
        </li>
        <li>
          <button title="Settings">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </li>
        {status === UserAuthStatus.AUTHENTICATED && (
          <li>
            <button title="Log out" onClick={() => dispatch(logout())}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
