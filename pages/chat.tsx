import chatStyles from "../styles/Chat.module.css";
import { Player } from "@lottiefiles/react-lottie-player";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PrivateRouteAlert from "../components/privateRouteAlert/PrivateRouteAlert";

export default function Chat() {
  const { user } = useSelector((state: RootState) => state.userSlice);
  return user ? (
    <div className={chatStyles.chatPageContainer}>
      <Player
        autoplay
        loop
        src="https://assets8.lottiefiles.com/private_files/lf30_y9czxcb9.json"
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <div>Chat feature would be added soon. Keep coming back.</div>
    </div>
  ) : (
    <PrivateRouteAlert />
  );
}
