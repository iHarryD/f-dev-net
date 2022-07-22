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
import { SentMessage, ReceivedMessage } from "../chatMessageBox/ChatMessageBox";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import { Chat } from "../../interfaces/Common.interface";
import SyncLoader from "react-spinners/SyncLoader";
import commonStyles from "../../styles/Common.module.css";
import { loaderCSSOverrides } from "../../database/loaderCSS";

export default function ChatScreen({
  activeChatID,
}: {
  activeChatID: string | null;
}) {
  const chats = useSelector((state: RootState) => state.chatSlice);
  const [chat, setChat] = useState<Chat | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const [otherUser, setOtherUser] = useState<{
    username: string;
    name: string;
    image: string;
  } | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  useEffect(() => {
    const chat = chats.find((chat) => chat._id === activeChatID);
    if (chat) {
      setChat(chat);
    }
  }, [activeChatID]);

  return chat && otherUser ? (
    <div className={chatScreenStyles.chatScreen}>
      <div className={chatScreenStyles.chatHeader}>
        <div className={chatScreenStyles.userDetailsContainer}>
          <div className={chatScreenStyles.profilePicturePreviewContainer}>
            <img
              src={otherUser.image}
              alt={otherUser.username}
              className={chatScreenStyles.profilePicturePreview}
            />
          </div>
          <div>{otherUser.name}</div>
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
      <div className={chatScreenStyles.chatBox}></div>
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
          ref={messageInputRef}
          placeholder="message..."
          className={chatScreenStyles.messageInput}
        />
        <button disabled={isSendingMessage}>
          {isSendingMessage ? (
            <div className={commonStyles.buttonLoaderContainer}>
              <SyncLoader
                size="6"
                color="#fff"
                loading={isSendingMessage}
                cssOverride={loaderCSSOverrides}
              />
            </div>
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} />
          )}
        </button>
      </div>
    </div>
  ) : (
    <h3>Loading...</h3>
  );
}
