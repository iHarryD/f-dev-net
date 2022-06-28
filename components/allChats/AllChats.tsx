import ChatPreview from "../chatPreview/ChatPreview";
import allChatsStyles from "./AllChats.module.css";

export default function AllChats() {
  return (
    <div className={allChatsStyles.chatSidebar}>
      <ul>
        <li>
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
          <ChatPreview />
        </li>
      </ul>
    </div>
  );
}
