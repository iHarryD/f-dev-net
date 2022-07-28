import loggedInUserProfileCardStyles from "./LoggedInUserProfileCard.module.css";
import commonStyles from "../../styles/Common.module.css";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export default function LoggedInUserProfileCard() {
  const { user } = useSelector((state: RootState) => state.userSlice);

  return (
    <div className={loggedInUserProfileCardStyles.userProfileCard}>
      <div>
        <img
          src={user?.image!}
          className={loggedInUserProfileCardStyles.profilePicturePreview}
        />
      </div>
      <div className={loggedInUserProfileCardStyles.nameUsernameContainer}>
        <span>{user?.name}</span>
        <span className={commonStyles.username}>{user?.username}</span>
      </div>
      <div className={loggedInUserProfileCardStyles.userStatsContainer}>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {user?.badges.length}
          </span>
          badges
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {user?.connections.length}
          </span>
          connections
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {user?.posts.length}
          </span>
          <span>posts</span>
        </div>
      </div>
    </div>
  );
}
