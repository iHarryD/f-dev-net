import loggedInUserProfileCardStyles from "./LoggedInUserProfileCard.module.css";
import commonStyles from "../../styles/Common.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { loginSetterAsProp } from "../../interfaces/Common.interface";

export default function LoggedInUserProfileCard({
  loginSetter,
}: loginSetterAsProp) {
  return (
    <div className={loggedInUserProfileCardStyles.userProfileCard}>
      <button
        title="Logout"
        className={loggedInUserProfileCardStyles.logoutButton}
        onClick={() => loginSetter(false)}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
      <div
        className={loggedInUserProfileCardStyles.profilePicturePreview}
      ></div>
      <div className={loggedInUserProfileCardStyles.nameUsernameContainer}>
        <span>Harry</span>
        <span className={commonStyles.username}>@harry</span>
      </div>
      <div className={loggedInUserProfileCardStyles.userStatsContainer}>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>12</span>
          posts
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>40</span>
          badges
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>50</span>
          connections
        </div>
      </div>
      <button
        className={`${buttonsStyles.primaryButton} ${loggedInUserProfileCardStyles.postButton}`}
      >
        Post
      </button>
    </div>
  );
}
