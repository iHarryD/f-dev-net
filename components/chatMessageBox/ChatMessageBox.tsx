import chatMessgaeBox from "./ChatMessageBox.module.css";

export default function ChatMessageBox() {
  return (
    <>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.sentMessage}`}
      >
        This is a messageInputBar
      </p>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.sentMessage}`}
      >
        This is a messageInputBar
      </p>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.receivedMessage}`}
      >
        This is a messageInputBar
      </p>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.receivedMessage}`}
      >
        This is a messageInputBar
      </p>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.sentMessage}`}
      >
        This is a messageInputBar
      </p>
      <p
        className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.receivedMessage}`}
      >
        This is a messageInputBar
      </p>
    </>
  );
}
