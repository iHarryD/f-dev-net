import chatStyles from "../styles/Chat.module.css";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

export default function Chat() {
  return (
    <div className={chatStyles.chatPageContainer}>
      <Player
        autoplay
        loop
        src="https://assets8.lottiefiles.com/private_files/lf30_y9czxcb9.json"
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <div>Chat feature would be added soon. Keep coming back.</div>
    </div>
  );
}
