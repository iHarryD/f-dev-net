import Head from "next/head";
import CreatePost from "../components/createPost/CreatePost";
import HomePageNavbar from "../components/homePageNavbar/HomePageNavbar";
import HomePageSidebar from "../components/homePageSidebar/HomePageSidebar";
import PostCard from "../components/postCard/PostCard";
import homeStyles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={homeStyles.main}>
      <Head>
        <title>Dev Net</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <HomePageSidebar />
      <div className={homeStyles.homePostsSection}>
        <CreatePost />
        {Array.from(Array(10)).map((item) => (
          <PostCard />
        ))}
      </div>
      <HomePageNavbar />
    </main>
  );
}

// export async function getServerSideProps({
//   req,
//   res,
// }: {
//   req: NextApiRequest;
//   res: NextApiResponse;
// }) {
//   const connection = await (await connectToMongoDb).connect();
//   try {
//     const session = await unstable_getServerSession(req, res, nextAuthConfig);
//     if (session === null) throw new Error();
//     const user = await connection
//       .db()
//       .collection("users")
//       .findOne({ username: session.user.username });
//     if (user === null) throw new Error();
//     const badges = connection
//       .db()
//       .collection("badges")
//       .find({ givenTo: session.user.username });
//     const connections = connection
//       .db()
//       .collection("connections")
//       .find({ connectionBetween: { $in: [session.user.username] } });
//     const posts = connection
//       .db()
//       .collection("posts")
//       .find({ postedBy: { username: session.user.username } });
//     return {
//       props: {
//         user: {
//           badges: await cursorToDoc(badges),
//           connections: await cursorToDoc(connections),
//           posts: await cursorToDoc(posts),
//           ...(await cursorToDoc(user)),
//         },
//       },
//     };
//   } catch (err) {
//     return {
//       props: {
//         user: null,
//       },
//     };
//   } finally {
//     connection.close();
//   }
// }
