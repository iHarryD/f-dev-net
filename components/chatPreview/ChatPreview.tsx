import chatPreviewStyles from "./ChatPreview.module.css";

export default function ChatPreview() {
  return (
    <div className={chatPreviewStyles.chatPreviewContainer}>
      <div className={chatPreviewStyles.smallProfilePicturePreview}></div>
      <div className={chatPreviewStyles.userNameAndMessagePreviewContainer}>
        <p className={chatPreviewStyles.userName}>Harry</p>
        <p className={chatPreviewStyles.lastMessagePreview}>See you at 10</p>
      </div>
    </div>
  );
}
