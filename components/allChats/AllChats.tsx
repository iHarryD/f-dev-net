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
  const chats = useSelector((state: RootState) => state.chatSlice);

  return (
    <div className={allChatsStyles.chatSidebar}>
      {chats.length > 0 ? (
        <ul></ul>
      ) : (
        <div className={allChatsStyles.emptyTextContainer}>
          <p className={allChatsStyles.emptyChatText}>No chats</p>
        </div>
      )}
    </div>
  );
}
