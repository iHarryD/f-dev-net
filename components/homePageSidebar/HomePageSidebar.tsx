import LoggedInHomeSidebar from "../loggedInHomeSidebar/LoggedInHomeSidebar";
import LoggedOutHomeSidebar from "../loggedOutHomeSidebar/LoggedOutHomeSidebar";
import homePageSidebarStyles from "./HomePageSidebar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserAuthStatus } from "../../interfaces/Common.interface";

export default function HomePageSidebar() {
  const { status } = useSelector((state: RootState) => state.userSlice);

  return (
    <div className={homePageSidebarStyles.homeSidebar}>
      {status === UserAuthStatus.AUTHENTICATED ? (
        <LoggedInHomeSidebar />
      ) : (
        <LoggedOutHomeSidebar />
      )}
    </div>
  );
}
