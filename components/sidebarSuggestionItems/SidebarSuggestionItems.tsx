import sidebarSuggestionItemsStyles from "./SidebarSuggestionItems.module.css";
import commonStyles from "../../styles/Common.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import { TagSuggestionProps } from "../../interfaces/SidebarTagSuggestion.interface";
import { UserSuggestionProps } from "../../interfaces/SidebarUserSuggestion.interface";

export function SidebarUserSuggestion({ name, username }: UserSuggestionProps) {
  return (
    <>
      <div className={sidebarSuggestionItemsStyles.userDetails}>
        <div
          className={sidebarSuggestionItemsStyles.userProfilePicturePreview}
        ></div>
        <div>
          <span>{name}</span>
          <span className={commonStyles.username}>@{username}</span>
        </div>
      </div>
      <button
        className={`${buttonsStyles.secondaryButton} ${sidebarSuggestionItemsStyles.followButton}`}
      >
        Follow
      </button>
    </>
  );
}

export function SidebarTagSuggestion({ tag }: TagSuggestionProps) {
  return (
    <>
      <span className={sidebarSuggestionItemsStyles.trendingText}>{tag}</span>
      <button
        className={`${buttonsStyles.secondaryButton} ${sidebarSuggestionItemsStyles.followButton}`}
      >
        Follow
      </button>
    </>
  );
}
