import Head from "next/head";
import CreatePost from "../components/createPost/CreatePost";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import homeStyles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={homeStyles.main}>
      <Head>
        <title>Dev Net</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <div className={homeStyles.homePostsSection}>
        <CreatePost />
      </div>
      <HomePageSidebar />
    </main>
  );
}
