import HomePageNavbar from "../components/macroPageNavbar/MacroPageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import commonStyles from "../styles/Common.module.css";
import PostCard from "../components/postCard/PostCard";
import { useEffect, useState } from "react";
import { Post } from "../interfaces/Common.interface";
import { getBookmarkPosts } from "../services/bookmarkServices";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import MoonLoader from "react-spinners/MoonLoader";
import PrivateRouteAlert from "../components/privateRouteAlert/PrivateRouteAlert";

export default function Saved() {
  const { user } = useSelector((state: RootState) => state.userSlice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      getBookmarkPosts(setIsLoading, (result) => setPosts(result.data.data)); // causes re-render
    }
  }, [user]);

  return user ? (
    <>
      <HomePageSidebar />
      <div className={commonStyles.pagePostsSection}>
        {isLoading ? (
          <MoonLoader />
        ) : (
          posts.map((post) => <PostCard key={post._id} details={post} />)
        )}
      </div>
      <HomePageNavbar />
    </>
  ) : (
    <PrivateRouteAlert />
  );
}
