import { ChatPreview as IChatPreview } from "../../interfaces/Common.interface";
import chatPreviewStyles from "./ChatPreview.module.css";

export default function ChatPreview({
  avatar,
  name,
  lastMessage,
  lastMessageTime,
}: IChatPreview) {
  return (
    <div className={chatPreviewStyles.chatPreviewContainer}>
      <div className={chatPreviewStyles.smallProfilePicturePreviewContainer}>
        <img
          src={avatar}
          alt={name}
          className={chatPreviewStyles.smallProfilePicturePreview}
        />
      </div>
      <div className={chatPreviewStyles.nameTimeChatPreview}>
        <div className={chatPreviewStyles.nameAndTimeContainer}>
          <span className={chatPreviewStyles.userName}>{name}</span>
          <span className={chatPreviewStyles.lastMessageTime}>
            {new Date(lastMessageTime).toLocaleDateString()}
          </span>
        </div>
        <p className={chatPreviewStyles.lastMessagePreview}>{lastMessage}</p>
      </div>
    </div>
  );
}
