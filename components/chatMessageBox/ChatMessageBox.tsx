import chatMessgaeBox from "./ChatMessageBox.module.css";

export function SentMessage({ message }: { message: string }) {
  return (
    <p className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.sentMessage}`}>
      {message}
    </p>
  );
}

export function ReceivedMessage({ message }: { message: string }) {
  return (
    <p
      className={`${chatMessgaeBox.messageBox} ${chatMessgaeBox.receivedMessage}`}
    >
      {message}
    </p>
  );
}
