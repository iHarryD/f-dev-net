import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faMagnifyingGlass,
  faExclamationCircle,
  faLink,
  faSmile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import chatScreenStyles from "./ChatScreen.module.css";
import ChatMessageBox from "../chatMessageBox/ChatMessageBox";

export default function ChatScreen() {
  return (
    <div className={chatScreenStyles.chatScreen}>
      <div className={chatScreenStyles.chatHeader}>
        <div className={chatScreenStyles.userDetailsContainer}>
          <div className={chatScreenStyles.profilePicturePreview}></div>
          <div>Harry </div>
        </div>
        <div className={chatScreenStyles.chatHeaderButtonContainer}>
          <div>
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <button>
            <FontAwesomeIcon icon={faVideoCamera} />
          </button>
          <button>
            <FontAwesomeIcon icon={faExclamationCircle} />
          </button>
        </div>
      </div>
      <div className={chatScreenStyles.chatBox}>
        <ChatMessageBox />
        <ChatMessageBox />
        <ChatMessageBox />
      </div>
      <div className={chatScreenStyles.messageInputBarContainer}>
        <div className={chatScreenStyles.messageInputBarButtonContainer}>
          <button>
            <FontAwesomeIcon icon={faLink} />
          </button>
          <button>
            <FontAwesomeIcon icon={faSmile} />
          </button>
        </div>
        <input
          placeholder="message..."
          className={chatScreenStyles.messageInput}
        />
        <button>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
