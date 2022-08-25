import {
  Connection,
  OwnConnection,
  Post,
  PostSortingOptions,
  UserPostFilter,
} from "../../interfaces/Common.interface";
import PostCard from "../postCard/PostCard";
import categoriesStyles from "./ProfileCategories.module.css";
import commonStyles from "../../styles/Common.module.css";
import { useEffect, useRef, useState } from "react";
import { getPosts } from "../../services/postServices";
import MoonLoader from "react-spinners/MoonLoader";
import Image from "next/image";
import Link from "next/link";

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

type MyConnections = {
  connections: OwnConnection[];
  isAdmin: true;
};

type ElseConnections = { connections: Connection[]; isAdmin: false };

type IConnections = MyConnections | ElseConnections;

export function Connections(props: IConnections) {
  const [activeConnectionFilter, setActiveConnectionFilter] =
    useState<ConnectionFilter>(ConnectionFilter.ALL);
  const [filteredConnections, setFilteredConnections] = useState(
    props.connections
  );

  useEffect(() => {
    if (props.isAdmin === false) return;
    if (activeConnectionFilter === ConnectionFilter.ACTIVE) {
      const filtered = props.connections.filter(
        (connection) => connection.isActive
      );
      setFilteredConnections(filtered);
    } else if (activeConnectionFilter === ConnectionFilter.PENDING) {
      const filtered = props.connections.filter(
        (connection) => connection.isActive === false
      );
      setFilteredConnections(filtered);
    } else {
      setFilteredConnections(props.connections);
    }
  }, [activeConnectionFilter, filteredConnections]);

  return props.connections.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      No connections.
    </p>
  ) : (
    <>
      {props.isAdmin && (
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
          <Link
            key={connection.connectionWith.username}
            href={`/profile?username=${connection.connectionWith.username}`}
          >
            <div
              className={categoriesStyles.connectionContainer}
              key={connection.connectionWith.username}
            >
              <div className={categoriesStyles.connectionUserDetails}>
                <div className={categoriesStyles.connectionUserImageContainer}>
                  {connection.connectionWith.image && (
                    <Image
                      src={connection.connectionWith.image}
                      alt={connection.connectionWith.username}
                      layout="fill"
                    />
                  )}
                </div>
                <div>
                  <div
                    className={categoriesStyles.connectionNameUsernameContainer}
                  >
                    <span>{connection.connectionWith.name}</span>
                    <span className={categoriesStyles.username}>
                      {connection.connectionWith.username}
                    </span>
                  </div>
                  <span>{connection.connectionWith.bio}</span>
                </div>
              </div>
            </div>
          </Link>
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
