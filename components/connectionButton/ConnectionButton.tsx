import Tippy from "@tippyjs/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/userSlice";
import { ConnectionStatus } from "../../interfaces/Common.interface";
import {
  acceptConnection,
  initiateConnection,
  removeConnection,
} from "../../services/connectionServices";
import { AppDispatch } from "../../store";
import buttonsStyles from "../../styles/Buttons.module.css";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";

export default function ConnectionButton({
  connectionID,
  connectionStatus,
  username,
}: {
  connectionID?: string;
  connectionStatus: ConnectionStatus;
  username?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleInitiateConnection() {
    if (username) {
      initiateConnection(username, setIsLoading, () => dispatch(updateUser()));
    }
  }

  function handleAcceptConnection() {
    if (username && connectionID) {
      acceptConnection(username, connectionID, setIsLoading, () =>
        dispatch(updateUser())
      );
    }
  }

  function handleDeleteConnection() {
    if (username && connectionID) {
      removeConnection(username, connectionID, setIsLoading, () =>
        dispatch(updateUser())
      );
    }
  }

  if (connectionStatus === ConnectionStatus.PENDING) {
    return (
      <Tippy content="accept connection request">
        <button
          disabled={isLoading}
          className={buttonsStyles.secondaryButton}
          onClick={() => handleAcceptConnection()}
        >
          {isLoading ? <ButtonSyncLoader color="#fff" /> : "Accept"}
        </button>
      </Tippy>
    );
  } else if (connectionStatus === ConnectionStatus.SENT) {
    return (
      <Tippy content="cancel connection request">
        <button
          disabled={isLoading}
          className={buttonsStyles.secondaryButton}
          onClick={() => handleDeleteConnection()}
        >
          {isLoading ? <ButtonSyncLoader color="#fff" /> : "Cancel"}
        </button>
      </Tippy>
    );
  } else if (connectionStatus === ConnectionStatus.CONNECTED) {
    return <button className={buttonsStyles.secondaryButton}>Message</button>;
  } else {
    return (
      <Tippy content="send connection request">
        <button
          disabled={isLoading}
          className={buttonsStyles.secondaryButton}
          onClick={() => handleInitiateConnection()}
        >
          {isLoading ? <ButtonSyncLoader color="#fff" /> : "Connect"}
        </button>
      </Tippy>
    );
  }
}
