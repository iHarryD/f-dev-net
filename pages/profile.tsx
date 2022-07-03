import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import ProfileSection from "../components/profileSection/ProfileSection";
import profileStyles from "../styles/Profile.module.css";
import { nextAuthConfig } from "./api/auth/[...nextauth]";
import connectToMongoDb from "../lib/mongodb";
import { User, UserWithStats } from "../interfaces/Common.interface";
import { cursorToDoc } from "../helpers/cursorToDoc";

export default function Profile({
  user: { details, isAdmin },
}: {
  user: { details: UserWithStats; isAdmin: boolean };
}) {
  return (
    <main className={profileStyles.profilePageMain}>
      <ProfileSection user={details} isAdmin={isAdmin} />
    </main>
  );
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user: {
    details: UserWithStats | null;
    isAdmin: boolean;
  } = {
    details: null,
    isAdmin: false,
  };
  let username: string;
  if (null) {
    username = "yes";
  } else {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session) {
      username = session.user.username;
      user.isAdmin = true;
    } else {
      throw new Error();
    }
  }
  const connection = await (await connectToMongoDb).connect();
  try {
    const session = await unstable_getServerSession(req, res, nextAuthConfig);
    if (session === null) throw new Error();
    const userDoc = await connection
      .db()
      .collection("users")
      .findOne({ username });
    if (userDoc === null) throw new Error();
    const badges = connection
      .db()
      .collection("badges")
      .find({ givenTo: username });
    const connections = connection
      .db()
      .collection("connections")
      .find({ connectionBetween: { $in: [username] } });
    const posts = connection
      .db()
      .collection("posts")
      .find({ postedBy: { username: username } });
    user.details = {
      badges: await cursorToDoc(badges),
      connections: await cursorToDoc(connections),
      posts: await cursorToDoc(posts),
      ...(await cursorToDoc(userDoc)),
    };
    return {
      props: {
        user,
      },
    };
  } catch (err) {
    return {
      props: {
        user,
      },
    };
  } finally {
    connection.close();
  }
}
