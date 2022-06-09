import AllChats from "../components/allChats/AllChats";
import ChatScreen from "../components/chatScreen/ChatScreen";
import chatStyles from "../styles/Chat.module.css";

export default function Chat() {
  return (
    <main className={chatStyles.chatPageMain}>
      <AllChats />
      <ChatScreen />
    </main>
  );
}
