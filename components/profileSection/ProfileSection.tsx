import profileSectionStyles from "./ProfileSection.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Connection,
  ConnectionStatus,
  OwnConnection,
  Post,
  User,
  UserWithStats,
} from "../../interfaces/Common.interface";
import ConnectionButton from "../connectionButton/ConnectionButton";
import { isImage } from "../../helpers/isImage";
import {
  getUser,
  updateUser as updateUserService,
} from "../../services/profileServices";
import MoonLoader from "react-spinners/MoonLoader";
import {
  Badges,
  Connections,
  Posts,
} from "../profileCategories/ProfileCategories";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { updateUser } from "../../features/userSlice";
import { toastEmitterConfig } from "../../data/toastEmitterConfig";
import { extractErrorMessage } from "../../helpers/extractErrorMessage";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import Tooltip from "../tooltip/Tooltip";
import {
  addToBlacklist,
  removeFromBlacklist,
} from "../../services/blacklistServices";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";

enum UserDetailCategories {
  BADGES = "BADGES",
  CONNECTIONS = "CONNECTIONS",
  POSTS = "POSTS",
}

interface OtherUser extends User {
  badges: string[];
  connections: Connection[];
  posts: Post[];
}

export default function ProfileSection() {
  const {
    query: { username: userQuery },
  } = useRouter();
  const { user: loggedInUser } = useSelector(
    (state: RootState) => state.userSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<UserWithStats | OtherUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const bioInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.NULL
  );
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [userDetailCategory, setUserDetailCategory] =
    useState<UserDetailCategories>(UserDetailCategories.BADGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLinkCopiedTippyActive, setIsLinkCopiedTippyActive] =
    useState<boolean>(false);
  const linkCopiedTippyTimeout = useRef<NodeJS.Timeout | null>(null);
  const [connectionWithUser, setConnectionWithUser] = useState<
    OwnConnection | undefined
  >(undefined);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (userQuery && userQuery !== loggedInUser?.username) {
      getUser(userQuery as string, setIsLoading, (result) => {
        if (loggedInUser) {
          const connectionWithUser = loggedInUser.connections.find(
            (connection) =>
              connection.connectionWith.username === result.data.data.username
          );
          setConnectionWithUser(connectionWithUser);
          evaluateConnectionStatus(
            connectionWithUser,
            loggedInUser.username,
            result.data.data.username
          );
          setUser(result.data.data as OtherUser);
          setIsAdmin(false);
        }
      });
    } else {
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAdmin(true);
      }
    }
    return () => {
      if (linkCopiedTippyTimeout.current) {
        clearTimeout(linkCopiedTippyTimeout.current);
      }
    };
  }, [userQuery]);

  useEffect(() => {
    if (loggedInUser && user && loggedInUser.username !== user.username) {
      const connectionWithUser = loggedInUser.connections.find(
        (connection) => connection.connectionWith.username === user.username
      );
      setConnectionWithUser(connectionWithUser);
      evaluateConnectionStatus(
        connectionWithUser,
        loggedInUser.username,
        user.username
      );
    }
  }, [loggedInUser]);

  function evaluateConnectionStatus(
    connection: OwnConnection | undefined,
    loggedInUserUsername: string,
    otherUserUsername: string
  ) {
    if (connection) {
      if (connection.isActive) {
        setConnectionStatus(ConnectionStatus.CONNECTED);
      } else if (connection.initiatedBy === loggedInUserUsername) {
        setConnectionStatus(ConnectionStatus.SENT);
      } else if (connection.initiatedBy === otherUserUsername) {
        setConnectionStatus(ConnectionStatus.PENDING);
      } else {
        setConnectionStatus(ConnectionStatus.NULL);
      }
    } else {
      setConnectionStatus(ConnectionStatus.NULL);
    }
  }

  async function handleUpdateUser() {
    if (nameInputRef.current === null || bioInputRef.current === null) return;
    const updatedUser: { name: string; bio: string; image?: File } = {
      name: nameInputRef.current.value,
      bio: bioInputRef.current.value,
    };
    if (updatedImage) {
      updatedUser.image = updatedImage;
    }
    updateUserService(
      updatedUser,
      setIsUpdating,
      () => dispatch(updateUser()),
      (err) => toast.error(extractErrorMessage(err), toastEmitterConfig)
    );
  }

  function handleAddToBlacklist() {
    if (user && loggedInUser) {
      addToBlacklist(user.username, undefined, () => dispatch(updateUser()));
    }
  }

  function handleRemoveFromBlacklist() {
    if (user && loggedInUser) {
      removeFromBlacklist(user.username, undefined, () => {
        dispatch(updateUser());
      });
    }
  }

  return (
    <>
      {isLoading || user === null ? (
        <div>
          <MoonLoader />
        </div>
      ) : (
        <>
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
                    disabled={!isAdmin}
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
                    disabled={!isAdmin}
                    ref={bioInputRef}
                    defaultValue={user.bio}
                    id="bio"
                    placeholder={user.bio}
                    className={profileSectionStyles.profileUpdatingInput}
                  />
                </div>
              </div>
              <div
                className={profileSectionStyles.profileSectionButtonContainer}
              >
                <div
                  className={`${commonStyles.horizontalFlexWithGap} ${profileSectionStyles.topButtonsContainer}`}
                >
                  <Tippy
                    content="link copied"
                    visible={isLinkCopiedTippyActive}
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/profile?username=${user.username}`
                        );
                        setIsLinkCopiedTippyActive(true);
                        linkCopiedTippyTimeout.current = setTimeout(() => {
                          setIsLinkCopiedTippyActive(false);
                        }, 1000);
                      }}
                      onMouseOut={() => {
                        if (isLinkCopiedTippyActive) {
                          setIsLinkCopiedTippyActive(false);
                          if (linkCopiedTippyTimeout.current) {
                            clearTimeout(linkCopiedTippyTimeout.current);
                          }
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faShareNodes} />
                    </button>
                  </Tippy>
                  {isAdmin === false && loggedInUser && (
                    <Tooltip
                      tooltipItems={[
                        {
                          tooltipChild: (
                            <div
                              className={
                                profileSectionStyles.blockUserTooltipItem
                              }
                            >
                              <span
                                className={profileSectionStyles.blockUserText}
                              >
                                {`${
                                  loggedInUser.blacklist.includes(user.username)
                                    ? "Unblock"
                                    : "Block"
                                } ${user.username}`}
                              </span>
                              <Tippy content="blocked users won't be able to send you connection requests">
                                <span>
                                  <FontAwesomeIcon icon={faExclamationCircle} />
                                </span>
                              </Tippy>
                            </div>
                          ),
                          tooltipOnClickHandler:
                            loggedInUser.blacklist.includes(user.username)
                              ? () => handleRemoveFromBlacklist()
                              : () => handleAddToBlacklist(),
                        },
                      ]}
                    />
                  )}
                </div>
                {isAdmin ? (
                  <button
                    className={buttonsStyles.secondaryButton}
                    onClick={() => handleUpdateUser()}
                  >
                    {isUpdating ? <ButtonSyncLoader color="#fff" /> : "Update"}
                  </button>
                ) : loggedInUser?.blacklist.includes(user.username) ? (
                  <button
                    className={buttonsStyles.secondaryButton}
                    onClick={() => handleRemoveFromBlacklist()}
                  >
                    Unblock
                  </button>
                ) : (
                  <ConnectionButton
                    connectionID={
                      connectionWithUser ? connectionWithUser._id : undefined
                    }
                    connectionStatus={connectionStatus}
                    username={user.username}
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
                onClick={() =>
                  setUserDetailCategory(UserDetailCategories.BADGES)
                }
              >
                badges
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
                connections
              </button>
              <button
                className={`${profileSectionStyles.userDetailCategoryButton} ${
                  userDetailCategory === UserDetailCategories.POSTS
                    ? profileSectionStyles.isShowing
                    : ""
                }`}
                onClick={() =>
                  setUserDetailCategory(UserDetailCategories.POSTS)
                }
              >
                posts
              </button>
            </div>
          </section>
          <section className={profileSectionStyles.categorySection}>
            {userDetailCategory === UserDetailCategories.POSTS && (
              <Posts posts={user.posts} user={user.username} />
            )}
            {userDetailCategory === UserDetailCategories.CONNECTIONS && (
              <Connections
                connections={user.connections}
                isAdmin={isAdmin as false}
              />
            )}
            {userDetailCategory === UserDetailCategories.BADGES && (
              <Badges badges={[]} />
            )}
          </section>
        </>
      )}
    </>
  );
}
