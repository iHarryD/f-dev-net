import { Connection, Post } from "../../interfaces/Common.interface";
import PostCard from "../postCard/PostCard";
import categoriesStyles from "./ProfileCategories.module.css";
import UsernameLink from "../usernameLink/UsernameLink";

export function Posts({ posts }: { posts: Post[] }) {
  return posts.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      You have no posts.
    </p>
  ) : (
    <div className={categoriesStyles.postsContainer}>
      {posts.map((post) => (
        <PostCard key={post._id} details={post} />
      ))}
    </div>
  );
}

export function Connections({
  connections,
  loggedInUser,
}: {
  connections: Connection[];
  loggedInUser: string;
}) {
  const simplifiedConnections = connections.map((connection) => {
    return {
      user: connection.connectionBetween.find((user) => user !== loggedInUser),
      status: connection.isActive,
    };
  });
  return simplifiedConnections.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      You have no connections.
    </p>
  ) : (
    <div>
      <div className={categoriesStyles.connectionContainer}>
        {simplifiedConnections.map((connection) => (
          <>
            <div className={categoriesStyles.connectionNameUsernameContainer}>
              <UsernameLink username={connection.user as string} />
            </div>
            <span>
              status:{" "}
              <span className={categoriesStyles.connectionStatus}>
                {connection.status ? "connected" : "pending"}
              </span>
            </span>
          </>
        ))}
      </div>
    </div>
  );
}

export function Badges({ badges }: { badges: Post[] }) {
  return (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      You have no badges.
    </p>
  );
}
