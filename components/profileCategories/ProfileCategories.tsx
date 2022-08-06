import {
  Connection,
  Post,
  PostSortingOptions,
  UserPostFilter,
} from "../../interfaces/Common.interface";
import PostCard from "../postCard/PostCard";
import categoriesStyles from "./ProfileCategories.module.css";
import UsernameLink from "../usernameLink/UsernameLink";
import commonStyles from "../../styles/Common.module.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getPosts } from "../../services/postServices";
import MoonLoader from "react-spinners/MoonLoader";

export function Posts({ posts, user }: { posts: Post[]; user: string }) {
  const [activePostFilter, setActivePostFilter] = useState<UserPostFilter>(
    UserPostFilter.POSTED
  );
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const firstLoad = useRef<boolean>(false);

  useEffect(() => {
    if (firstLoad.current) {
      getPosts(
        PostSortingOptions.DATE,
        undefined,
        user,
        activePostFilter,
        setIsLoading,
        (result) => setFilteredPosts(result.data.data)
      );
    } else {
      firstLoad.current = true;
    }
  }, [activePostFilter]);

  return posts.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>No posts.</p>
  ) : (
    <>
      <select
        value={activePostFilter}
        className={`${commonStyles.styledDropdown} ${categoriesStyles.categoryFilterDropdown}`}
        onChange={(e) => setActivePostFilter(e.target.value as UserPostFilter)}
      >
        <option>{UserPostFilter.POSTED}</option>
        <option>{UserPostFilter.LIKED}</option>
        <option>{UserPostFilter.COMMENTED}</option>
      </select>
      <div className={categoriesStyles.postsContainer}>
        {isLoading && <MoonLoader size={25} />}
        {filteredPosts.map((post) => (
          <PostCard key={post._id} details={post} />
        ))}
      </div>
    </>
  );
}

enum ConnectionFilter {
  ACTIVE = "active",
  ALL = "all",
  PENDING = "pending",
}

interface SimplifiedConnection {
  status: boolean;
  user: string;
}

export function Connections({
  connections,
  loggedInUser,
}: {
  connections: Connection[];
  loggedInUser: string;
}) {
  const [activeConnectionFilter, setActiveConnectionFilter] =
    useState<ConnectionFilter>(ConnectionFilter.ALL);
  const [filteredConnections, setFilteredConnections] = useState<
    SimplifiedConnection[]
  >(simplifyConnection(connections));
  const { user } = useSelector((state: RootState) => state.userSlice);

  function simplifyConnection(
    connections: Connection[]
  ): SimplifiedConnection[] {
    return connections.map((connection) => {
      return {
        user: connection.connectionBetween.find(
          (user) => user !== loggedInUser
        ) as string,
        status: connection.isActive,
      };
    });
  }

  useEffect(() => {
    if (activeConnectionFilter === ConnectionFilter.ACTIVE) {
      const filtered = connections.filter((connection) => connection.isActive);
      setFilteredConnections(simplifyConnection(filtered));
    } else if (activeConnectionFilter === ConnectionFilter.PENDING) {
      const filtered = connections.filter(
        (connection) => connection.isActive === false
      );
      setFilteredConnections(simplifyConnection(filtered));
    } else {
      setFilteredConnections(simplifyConnection(connections));
    }
  }, [activeConnectionFilter, filteredConnections]);

  return connections.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      No connections.
    </p>
  ) : (
    <>
      {user?.username === loggedInUser && (
        <select
          value={activeConnectionFilter}
          className={`${commonStyles.styledDropdown} ${categoriesStyles.categoryFilterDropdown}`}
          onChange={(e) =>
            setActiveConnectionFilter(e.target.value as ConnectionFilter)
          }
        >
          <option>{ConnectionFilter.ALL}</option>
          <option>{ConnectionFilter.ACTIVE}</option>
          <option>{ConnectionFilter.PENDING}</option>
        </select>
      )}
      <div className={categoriesStyles.connectionsContainer}>
        {filteredConnections.map((connection) => (
          <div className={categoriesStyles.connectionContainer}>
            <div className={categoriesStyles.connectionNameUsernameContainer}>
              <UsernameLink username={connection.user as string} />
            </div>
            <span>
              status:{" "}
              <span className={categoriesStyles.connectionStatus}>
                {connection.status ? "connected" : "pending"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function Badges({ badges }: { badges: Post[] }) {
  return (
    <p className={categoriesStyles.emptyCategoryTextContainer}>No badges.</p>
  );
}
