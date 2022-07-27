import { Connection, Post } from "../../interfaces/Common.interface";
import PostCard from "../postCard/PostCard";
import categoriesStyles from "./ProfileCategories.module.css";
import buttonsStyles from "../../styles/Buttons.module.css";

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

export function Connections({ connections }: { connections: Connection[] }) {
  return connections.length === 0 ? (
    <p className={categoriesStyles.emptyCategoryTextContainer}>
      You have no connections.
    </p>
  ) : (
    <div>
      <div className={categoriesStyles.connectionContainer}>
        <div className={categoriesStyles.fakePic}></div>
        <div className={categoriesStyles.connectionNameUsernameContainer}>
          <span>Harry</span>
          <span className={categoriesStyles.username}>harry</span>
        </div>
        <button
          className={`${buttonsStyles.primaryButton} ${categoriesStyles.connectionButton}`}
        >
          Connected
        </button>
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
