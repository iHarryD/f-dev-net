import profileSectionStyles from "./ProfileSection.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { UserWithStats } from "../../interfaces/Common.interface";

export default function ProfileSection() {
  const {
    query: { user: userQuery },
  } = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const bioInputRef = useRef<HTMLTextAreaElement | null>(null);
  // const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (userQuery) {
      (async () => {
        try {
          const result = await fetch(
            `http://127.0.0.1:3000/api/profiles/${userQuery}`
          );
          const data = await JSON.parse(JSON.stringify(result));
          setUser(data);
          if (session?.user.username === userQuery) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      if (session) {
        setUser(session.user);
        setIsAdmin(true);
      }
    }
  }, [userQuery, session]);

  async function handleUpdateUser(name: string, bio: string) {
    const data = {
      name,
      bio,
    };
    fetch("http://127.0.0.1:3000/api/profiles", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return (
    <>
      {user ? (
        <section className={profileSectionStyles.profileSection}>
          <div className={profileSectionStyles.profileSectionUpper}>
            <div
              className={profileSectionStyles.profilePictureUsernameContainer}
            >
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
                className={`${
                  profileSectionStyles.profileUpdatingInputContainer
                } ${isAdmin ? "" : profileSectionStyles.notAdmin}`}
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
                className={`${
                  profileSectionStyles.profileUpdatingInputContainer
                } ${isAdmin ? "" : profileSectionStyles.notAdmin}`}
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
                    handleUpdateUser(
                      nameInputRef.current.value,
                      bioInputRef.current.value
                    );
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
      ) : (
        "Loading..."
      )}
    </>
  );
}
