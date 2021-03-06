import { NextApiRequest, NextApiResponse } from "next";
import AllChats from "../components/allChats/AllChats";
import ChatScreen from "../components/chatScreen/ChatScreen";
import chatStyles from "../styles/Chat.module.css";
import connectToMongoDb from "../lib/mongodb";
import { cursorToDoc } from "../helpers/cursorToDoc";
import { unstable_getServerSession } from "next-auth";
import { Chat as IChat } from "../interfaces/Common.interface";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refresh } from "../features/chatSlice";
import { useAuth } from "../contexts/AuthContext";

export default function Chat({ chats: newChats }: { chats: IChat[] }) {
  const dispatch = useDispatch();
  const [activeChatID, setActiveChatID] = useState<string | null>(null);

  useEffect(() => {
    dispatch(refresh({ newChats }));
    if (newChats.length > 0) {
      setActiveChatID(newChats[0]._id);
    }
  }, []);

  return (
    <div className={chatStyles.chatPageContainer}>
      <AllChats activeChatIDSetter={setActiveChatID} />
      <ChatScreen activeChatID={activeChatID} />
    </div>
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
    const userChats = connection
      .db()
      .collection("chats")
      .find({
        chatBetween: {
          $elemMatch: { username: userCredentials.user.username },
        },
      });
    return {
      props: {
        chats: await cursorToDoc(userChats),
      },
    };
  } catch (err) {
    return {
      props: {
        chats: [],
      },
    };
  } finally {
    connection.close();
  }
}
