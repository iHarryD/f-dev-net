import loggedInUserProfileCardStyles from "./LoggedInUserProfileCard.module.css";
import commonStyles from "../../styles/Common.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function LoggedInUserProfileCard() {
  const { userCredentials } = useAuth();

  useEffect(() => console.log(userCredentials), []);

  return (
    <div className={loggedInUserProfileCardStyles.userProfileCard}>
      <div>
        <img
          src={userCredentials.user?.image!}
          className={loggedInUserProfileCardStyles.profilePicturePreview}
        />
      </div>
      <div className={loggedInUserProfileCardStyles.nameUsernameContainer}>
        <span>{userCredentials.user?.name}</span>
        <span className={commonStyles.username}>
          {userCredentials.user?.username}
        </span>
      </div>
      <div className={loggedInUserProfileCardStyles.userStatsContainer}>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {userCredentials.user?.badges.length}
          </span>
          badges
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {userCredentials.user?.connections.length}
          </span>
          connections
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {userCredentials.user?.posts.length}
          </span>
          <span>posts</span>
        </div>
      </div>
    </div>
  );
}
