import { useState } from "react";
import LoggedInHomeSidebar from "../loggedInHomeSidebar/LoggedInHomeSidebar";
import LoggedOutHomeSidebar from "../loggedOutHomeSidebar/LoggedOutHomeSidebar";
import homePageSidebarStyles from "./HomePageSidebar.module.css";

export default function HomePageSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  return (
    <div className={homePageSidebarStyles.homeSidebar}>
      {isLoggedIn ? (
        <LoggedInHomeSidebar loginSetter={setIsLoggedIn} />
      ) : (
        <LoggedOutHomeSidebar loginSetter={setIsLoggedIn} />
      )}
    </div>
  );
}
