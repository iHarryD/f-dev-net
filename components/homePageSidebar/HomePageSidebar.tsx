import LoggedInHomeSidebar from "../loggedInHomeSidebar/LoggedInHomeSidebar";
import LoggedOutHomeSidebar from "../loggedOutHomeSidebar/LoggedOutHomeSidebar";
import homePageSidebarStyles from "./HomePageSidebar.module.css";
import { useAuth } from "../../contexts/AuthContext";

export default function HomePageSidebar() {
  const { status } = useAuth();

  return (
    <div className={homePageSidebarStyles.homeSidebar}>
      {status === "authenticated" ? (
        <LoggedInHomeSidebar />
      ) : (
        <LoggedOutHomeSidebar />
      )}
    </div>
  );
}
