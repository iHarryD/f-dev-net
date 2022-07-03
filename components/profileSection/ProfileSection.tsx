import profileSectionStyles from "./ProfileSection.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { User, UserWithStats } from "../../interfaces/Common.interface";

export default function ProfileSection({
  user,
  isAdmin,
}: {
  user: UserWithStats;
  isAdmin: boolean;
}) {
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const bioInputRef = useRef<HTMLTextAreaElement | null>(null);
  // const imageInputRef = useRef<HTMLInputElement>(null)

  async function handleUpdateUser({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) {
    const data = {
      name,
      bio,
    };
    fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return (
    <section className={profileSectionStyles.profileSection}>
      <div className={profileSectionStyles.profileSectionUpper}>
        <div className={profileSectionStyles.profilePictureUsernameContainer}>
          <div>
            <img
              src={user.image}
              alt="profile-picture"
              className={profileSectionStyles.profilePicture}
            />
          </div>
          <p
            className={`${profileSectionStyles.username} ${commonStyles.username}`}
          >
            {user.username}
          </p>
        </div>
        <div className={profileSectionStyles.nameBioInputContainer}>
          <div
            className={`${profileSectionStyles.profileUpdatingInputContainer} ${
              isAdmin ? "" : profileSectionStyles.notAdmin
            }`}
          >
            <label htmlFor="name">Name</label>
            <input
              ref={nameInputRef}
              defaultValue={user.name}
              id="name"
              placeholder={user.name}
              className={profileSectionStyles.profileUpdatingInput}
            />
          </div>
          <div
            className={`${profileSectionStyles.profileUpdatingInputContainer} ${
              isAdmin ? "" : profileSectionStyles.notAdmin
            }`}
          >
            <label htmlFor="bio">Bio</label>
            <textarea
              ref={bioInputRef}
              defaultValue={user.bio}
              id="bio"
              placeholder={user.bio}
              className={profileSectionStyles.profileUpdatingInput}
            />
          </div>
        </div>
        <div className={profileSectionStyles.profileSectionButtonContainer}>
          <button className={profileSectionStyles.shareProfileButton}>
            <FontAwesomeIcon icon={faShareNodes} />
          </button>
          {isAdmin && (
            <button
              className={buttonsStyles.primaryButton}
              onClick={() => {
                if (
                  nameInputRef.current === null ||
                  bioInputRef.current === null
                )
                  return;
                handleUpdateUser({
                  name: nameInputRef.current.value,
                  bio: bioInputRef.current.value,
                });
              }}
            >
              Update
            </button>
          )}
        </div>
      </div>
      <div className={profileSectionStyles.userStatsContainer}>
        <p>{user.badges.length} badges</p>
        <p>{user.connections.length} connections</p>
        <p>{user.posts.length} posts</p>
      </div>
    </section>
  );
}
