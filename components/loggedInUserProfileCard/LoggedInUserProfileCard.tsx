import loggedInUserProfileCardStyles from "./LoggedInUserProfileCard.module.css";
import commonStyles from "../../styles/Common.module.css";
import { useSession } from "next-auth/react";

export default function LoggedInUserProfileCard() {
  const { data: session } = useSession();

  return (
    <div className={loggedInUserProfileCardStyles.userProfileCard}>
      <div>
        <img
          src={session?.user.image!}
          className={loggedInUserProfileCardStyles.profilePicturePreview}
        />
      </div>
      <div className={loggedInUserProfileCardStyles.nameUsernameContainer}>
        <span>{session?.user.name}</span>
        <span className={commonStyles.username}>{session?.user.username}</span>
      </div>
      <div className={loggedInUserProfileCardStyles.userStatsContainer}>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {session?.user.badges.length}
          </span>
          badges
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {session?.user.connections.length}
          </span>
          connections
        </div>
        <div className={loggedInUserProfileCardStyles.userStatsBox}>
          <span className={loggedInUserProfileCardStyles.statsNumber}>
            {session?.user.posts.length}
          </span>
          <span>posts</span>
        </div>
      </div>
    </div>
  );
}
