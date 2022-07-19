import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ChatPreview from "../chatPreview/ChatPreview";
import allChatsStyles from "./AllChats.module.css";

export default function AllChats({
  activeChatIDSetter,
}: {
  activeChatIDSetter: Dispatch<SetStateAction<string | null>>;
}) {
  const { data: session } = useSession() as { data: Session };
  const chats = useSelector((state: RootState) => state.chatSlice);

  return (
    <div className={allChatsStyles.chatSidebar}>
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => {
            const otherUser = chat.chatBetween.find(
              (user) => user.username !== session.user.username
            );
            if (otherUser)
              return (
                <li>
                  <button
                    className={allChatsStyles.chatPreviewButton}
                    onClick={() => activeChatIDSetter(chat._id)}
                  >
                    <ChatPreview
                      key={chat._id}
                      _id={chat._id}
                      avatar={otherUser.image}
                      name={otherUser.name}
                      lastMessage={
                        chat.conversation[chat.conversation.length - 1].message
                      }
                      lastMessageTime={
                        chat.conversation[chat.conversation.length - 1]
                          .timestamp
                      }
                    />
                  </button>
                </li>
              );
          })}
        </ul>
      ) : (
        <div className={allChatsStyles.emptyTextContainer}>
          <p className={allChatsStyles.emptyChatText}>No chats</p>
        </div>
      )}
    </div>
  );
}
