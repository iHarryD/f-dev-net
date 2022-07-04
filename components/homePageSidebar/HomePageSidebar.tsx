import LoggedInHomeSidebar from "../loggedInHomeSidebar/LoggedInHomeSidebar";
import LoggedOutHomeSidebar from "../loggedOutHomeSidebar/LoggedOutHomeSidebar";
import homePageSidebarStyles from "./HomePageSidebar.module.css";
import { useSession } from "next-auth/react";

export default function HomePageSidebar() {
  const { data: session } = useSession();

  return (
    <div className={homePageSidebarStyles.homeSidebar}>
      {session ? <LoggedInHomeSidebar /> : <LoggedOutHomeSidebar />}
    </div>
  );
}
