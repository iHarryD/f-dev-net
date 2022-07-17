import { NextApiRequest, NextApiResponse } from "next";
import HomePageNavbar from "../components/homePageNavbar/HomePageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import { cursorToDoc } from "../helpers/cursorToDoc";
import commonStyles from "../styles/Common.module.css";
import connectToMongoDb from "../lib/mongodb";
import { unstable_getServerSession } from "next-auth";
import { nextAuthConfig } from "./api/auth/[...nextauth]";
import { Post } from "../interfaces/Common.interface";
import PostCard from "../components/postCard/PostCard";
import { ObjectId } from "mongodb";

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
  const connection = await (await connectToMongoDb).connect();
  try {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session === null) {
      return {
        props: {
          posts: [],
        },
      };
    }
    const result = connection
      .db()
      .collection("posts")
      .find({
        _id: { $all: session.user.savedPosts.map((id) => new ObjectId(id)) },
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
