import profileSectionStyles from "./ProfileSection.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Connection,
  ConnectionStatus,
  UserWithStats,
} from "../../interfaces/Common.interface";
import ConnectionButton from "../connectionButton/ConnectionButton";
import { isImage } from "../../helpers/isImage";
import { getUser, updateUser } from "../../services/profileServices";
import { useAuth } from "../../contexts/AuthContext";

enum UserDetailCategories {
  BADGES = "BADGES",
  CONNECTIONS = "CONNECTIONS",
  POSTS = "POSTS",
}

export default function ProfileSection() {
  const {
    query: { username: userQuery },
  } = useRouter();
  const { userCredentials } = useAuth();
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const bioInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.NULL
  );
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [userDetailCategory, setUserDetailCategory] =
    useState<UserDetailCategories>(UserDetailCategories.BADGES);

  useEffect(() => {
    if (userQuery) {
      getUser(userQuery as string, undefined, (result) => {
        if (result.data.data.username === userCredentials.user?.username) {
          setIsAdmin(true);
          return;
        }
        const connectionStatusWithUser = result.data.data.data.connections.find(
          (connection: Connection) =>
            connection.connectionBetween.includes(
              result.data.data.data.username
            )
        );
        if (connectionStatusWithUser) {
          if (connectionStatusWithUser.isActive) {
            setConnectionStatus(ConnectionStatus.CONNECTED);
          } else {
            if (
              connectionStatusWithUser.initiatedBy ===
              userCredentials.user?.username
            ) {
              setConnectionStatus(ConnectionStatus.SENT);
            } else {
              setConnectionStatus(ConnectionStatus.PENDING);
            }
          }
        } else {
          setConnectionStatus(ConnectionStatus.NULL);
        }
        setIsAdmin(false);
      });
    } else {
      if (userCredentials) {
        setUser(userCredentials.user);
        setIsAdmin(true);
      }
    }
  }, [userQuery, userCredentials]);

  async function handleUpdateUser() {
    if (nameInputRef.current === null || bioInputRef.current === null) return;
    const updatedUser: { name: string; bio: string; image?: File } = {
      name: nameInputRef.current.value,
      bio: bioInputRef.current.value,
    };
    if (updatedImage) {
      updatedUser.image = updatedImage;
    }
    updateUser(updatedUser);
  }

  return (
    <>
      {user ? (
        <section className={profileSectionStyles.profileSection}>
          <div className={profileSectionStyles.profileSectionUpper}>
            <div
              className={profileSectionStyles.profilePictureUsernameContainer}
            >
              <div
                className={profileSectionStyles.profilePictureUpdateContainer}
              >
                {isAdmin ? (
                  <>
                    <div
                      className={
                        profileSectionStyles.profilePictureUpdateOverlay
                      }
                    >
                      <span
                        className={
                          profileSectionStyles.profilePictureUpdateOverlayText
                        }
                      >
                        Change
                      </span>
                    </div>
                    <label htmlFor="update-profile-picture">
                      <img
                        src={
                          updatedImage
                            ? URL.createObjectURL(updatedImage)
                            : user.image
                        }
                        alt="profile-picture"
                        className={profileSectionStyles.profilePicture}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="update-profile-picture"
                        className={profileSectionStyles.profilePictureInput}
                        onChange={(e) => {
                          if (e.target.files) {
                            if (isImage(e.target.files[0])) {
                              setUpdatedImage(e.target.files[0]);
                            }
                          }
                        }}
                      />
                    </label>
                  </>
                ) : (
                  <img
                    src={user.image}
                    alt="profile-picture"
                    className={profileSectionStyles.profilePicture}
                  />
                )}
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
              {isAdmin ? (
                <button
                  className={buttonsStyles.primaryButton}
                  onClick={() => handleUpdateUser()}
                >
                  Update
                </button>
              ) : (
                <ConnectionButton
                  connectionStatus={connectionStatus}
                  user={user}
                />
              )}
            </div>
          </div>
          <div className={profileSectionStyles.userStatsContainer}>
            <button
              className={`${profileSectionStyles.userDetailCategoryButton} ${
                userDetailCategory === UserDetailCategories.BADGES
                  ? profileSectionStyles.isShowing
                  : ""
              }`}
              onClick={() => setUserDetailCategory(UserDetailCategories.BADGES)}
            >
              {user.badges.length} badges
            </button>
            <button
              className={`${profileSectionStyles.userDetailCategoryButton} ${
                userDetailCategory === UserDetailCategories.CONNECTIONS
                  ? profileSectionStyles.isShowing
                  : ""
              }`}
              onClick={() =>
                setUserDetailCategory(UserDetailCategories.CONNECTIONS)
              }
            >
              {user.connections.length} connections
            </button>
            <button
              className={`${profileSectionStyles.userDetailCategoryButton} ${
                userDetailCategory === UserDetailCategories.POSTS
                  ? profileSectionStyles.isShowing
                  : ""
              }`}
              onClick={() => setUserDetailCategory(UserDetailCategories.POSTS)}
            >
              {user.posts.length} posts
            </button>
          </div>
        </section>
      ) : (
        "Loading..."
      )}
    </>
  );
}
