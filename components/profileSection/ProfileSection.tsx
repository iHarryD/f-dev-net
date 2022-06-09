import profileSectionStyles from "./ProfileSection.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";

export default function ProfileSection() {
  return (
    <section className={profileSectionStyles.profileSection}>
      <div className={profileSectionStyles.profileSectionUpper}>
        <div className={profileSectionStyles.profilePictureUsernameContainer}>
          <div className={profileSectionStyles.profilePicture}></div>
          <p className={profileSectionStyles.username}>harry910</p>
        </div>
        <div className={profileSectionStyles.nameBioInputContainer}>
          <div className={profileSectionStyles.profileUpdatingInputContainer}>
            <label htmlFor="first-name">Firstname</label>
            <input
              id="first-name"
              placeholder="Harry Dan"
              className={profileSectionStyles.profileUpdatingInput}
            />
          </div>
          <div className={profileSectionStyles.profileUpdatingInputContainer}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className={profileSectionStyles.profileUpdatingInput}
            />
          </div>
        </div>
        <div className={profileSectionStyles.profileSectionButtonContainer}>
          <button className={profileSectionStyles.shareProfileButton}>
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
          <button className={buttonsStyles.primaryButton}>Update</button>
        </div>
      </div>
      <div className={profileSectionStyles.userStatsContainer}>
        <p>20 posts</p>
        <p>564 badges</p>
        <p>1 connections</p>
      </div>
    </section>
  );
}
