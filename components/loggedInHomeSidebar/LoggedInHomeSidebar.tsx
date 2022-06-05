import LoggedInUserProfileCard from "../loggedInUserProfileCard/LoggedInUserProfileCard";
import loggedInHomeSidebarStyles from "./LoggedInHomeSidebar.module.css";
import {
  SidebarTagSuggestion,
  SidebarUserSuggestion,
} from "../sidebarSuggestionItems/SidebarSuggestionItems";
import { loginSetterAsProp } from "../../interfaces/Common.interface";

export default function LoggedInHomeSidebar({
  loginSetter,
}: loginSetterAsProp) {
  return (
    <>
      <LoggedInUserProfileCard loginSetter={loginSetter} />
      <div>
        <h3>Top trends for you</h3>
        <ul
          className={`${loggedInHomeSidebarStyles.listContainer} ${loggedInHomeSidebarStyles.trendingTagsListContainer}`}
        >
          {["React", "Next", "Web3"].map((item) => (
            <li className={loggedInHomeSidebarStyles.sidebarListItems}>
              <SidebarTagSuggestion tag={item} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Users you may know</h3>
        <ul className={loggedInHomeSidebarStyles.listContainer}>
          {[
            { name: "Harry", username: "Harry910" },
            { name: "Harry", username: "Harry910" },
            { name: "Harry", username: "Harry910" },
          ].map(({ name, username }) => (
            <li className={loggedInHomeSidebarStyles.sidebarListItems}>
              <SidebarUserSuggestion name={name} username={username} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
