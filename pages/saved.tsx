import { NextApiRequest, NextApiResponse } from "next";
import HomePageNavbar from "../components/homePageNavbar/HomePageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import { cursorToDoc } from "../helpers/cursorToDoc";
import commonStyles from "../styles/Common.module.css";
import connectToMongoDb from "../lib/mongodb";
import { Post } from "../interfaces/Common.interface";
import PostCard from "../components/postCard/PostCard";
import { ObjectId } from "mongodb";
import { useAuth } from "../contexts/AuthContext";

export default function Saved({ posts }: { posts: Post[] }) {
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

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const { userCredentials } = useAuth();
  if (userCredentials.user === null) {
    return {
      props: {
        posts: [],
      },
    };
  }
  const connection = await (await connectToMongoDb).connect();
  try {
    const result = connection
      .db()
      .collection("posts")
      .find({
        _id: {
          $all: userCredentials.user.savedPosts.map((id) => new ObjectId(id)),
        },
      })
      .sort({ timestamp: -1 });
    return {
      props: {
        posts: await cursorToDoc(result),
      },
    };
  } catch (err) {
    return {
      props: {
        posts: [],
      },
    };
  } finally {
    connection.close();
  }
}
