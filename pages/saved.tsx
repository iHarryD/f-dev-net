import HomePageNavbar from "../components/macroPageNavbar/MacroPageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import commonStyles from "../styles/Common.module.css";
import PostCard from "../components/postCard/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Post } from "../interfaces/Common.interface";
import { getBookmarkPosts } from "../services/bookmarkServices";

export default function Saved() {
  const { userCredentials } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (userCredentials.user) {
      getBookmarkPosts(undefined, (result) => setPosts(result.data.data));
    }
  }, [userCredentials.user]);

  return (
    <>
      <HomePageSidebar />
      <div className={commonStyles.pagePostsSection}>
        {posts.map((post) => (
          <PostCard key={post._id} details={post} />
        ))}
      </div>
      <HomePageNavbar />
    </>
  );
}
