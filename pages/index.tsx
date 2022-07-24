import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import CreatePost from "../components/createPost/CreatePost";
import PostCard from "../components/postCard/PostCard";
import commonStyles from "../styles/Common.module.css";
import connectToMongoDb from "../lib/mongodb";
import { cursorToDoc } from "../helpers/cursorToDoc";
import { Post } from "../interfaces/Common.interface";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { refresh } from "../features/postSlice";
import { RootState } from "../store";
import { getPosts } from "../services/postServices";
import HomePageNavbar from "../components/homePageNavbar/HomePageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import useInMobileView from "../hooks/useInMobileView";

export default function Home({ posts: newPosts }: { posts: Post[] }) {
  const posts = useSelector((state: RootState) => state.postSlice);
  const dispatch = useDispatch();
  const [sortedBy, setSortedBy] = useState<"date" | "trending">("date");
  const [filterBy, setFilterBy] = useState<"general" | "query" | null>(null);
  const { inMobileView } = useInMobileView();
  const inititalFetch = useRef(false);

  useEffect(() => {
    dispatch(refresh({ newPosts }));
  }, []);

  useEffect(() => {
    if (inititalFetch.current === false) {
      inititalFetch.current = true;
    } else {
      (async () => {
        await getPosts(sortedBy, filterBy, undefined, (result) => {
          dispatch(refresh({ newPosts: result.data.data }));
        });
      })();
    }
  }, [sortedBy, filterBy]);

  return (
    <>
      <Head>
        <title>Dev Net</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <>
        {inMobileView === false && <HomePageSidebar />}
        <div className={commonStyles.pagePostsSection}>
          <CreatePost />
          <div className={commonStyles.chipContainer}>
            <div
              className={`${commonStyles.chip} ${
                sortedBy === "date" ? commonStyles.chipActive : ""
              }`}
            >
              <label>
                <input
                  defaultChecked
                  type="checkbox"
                  name="post-sort-by"
                  onChange={() => setSortedBy("date")}
                />
                date
              </label>
            </div>
            <div
              className={`${commonStyles.chip} ${
                sortedBy === "trending" ? commonStyles.chipActive : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  name="post-sort-by"
                  onChange={() => setSortedBy("trending")}
                />
                trending
              </label>
            </div>
            <div
              className={`${commonStyles.chip} ${
                filterBy === "general" ? commonStyles.chipActive : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  name="post-filter-by"
                  onChange={() => setFilterBy("general")}
                />
                general
              </label>
            </div>
            <div
              className={`${commonStyles.chip} ${
                filterBy === "query" ? commonStyles.chipActive : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  name="post-filter-by"
                  onChange={() => setFilterBy("query")}
                />
                query
              </label>
            </div>
          </div>
          <div className={commonStyles.postsContainer}>
            {posts.map((post) => (
              <PostCard key={post._id} details={post} />
            ))}
          </div>
        </div>
        <HomePageNavbar />
      </>
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
    const result = connection
      .db()
      .collection("posts")
      .find({})
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
