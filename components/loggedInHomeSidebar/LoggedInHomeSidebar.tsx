import LoggedInUserProfileCard from "../loggedInUserProfileCard/LoggedInUserProfileCard";
import loggedInHomeSidebarStyles from "./LoggedInHomeSidebar.module.css";
import {
  SidebarTagSuggestion,
  SidebarUserSuggestion,
} from "../sidebarSuggestionItems/SidebarSuggestionItems";

export default function LoggedInHomeSidebar() {
  return (
    <>
      <LoggedInUserProfileCard />
      {/* <div>
        <h3>Top tags for you</h3>
        <ul
          className={`${loggedInHomeSidebarStyles.listContainer} ${loggedInHomeSidebarStyles.trendingTagsListContainer}`}
        >
          {["React", "Next", "Web3"].map((item) => (
            <li
              key={item}
              className={loggedInHomeSidebarStyles.sidebarListItems}
            >
              <SidebarTagSuggestion tag={item} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Users you may know</h3>
        <ul className={loggedInHomeSidebarStyles.listContainer}>
          {[{ name: "Harry" }, { name: "Harry" }, { name: "Harry" }].map(
            ({ name }, index) => (
              <li
                key={index}
                className={loggedInHomeSidebarStyles.sidebarListItems}
              >
                <SidebarUserSuggestion name={name} />
              </li>
            )
          )}
        </ul>
      </div> */}
    </>
  );
}
