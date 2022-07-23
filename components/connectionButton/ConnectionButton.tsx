import { useState } from "react";
import { loaderCSSOverrides } from "../../data/loaderCSS";
import {
  ConnectionStatus,
  UserWithStats,
} from "../../interfaces/Common.interface";
import {
  acceptConnection,
  initiateConnection,
} from "../../services/connectionServices";
import buttonsStyles from "../../styles/Buttons.module.css";
import commonStyles from "../../styles/Common.module.css";
import { ButtonSyncLoader } from "../buttonLoaders/ButtonLoaders";

export default function ConnectionButton({
  connectionID,
  connectionStatus,
  user,
}: {
  connectionID?: string;
  connectionStatus: ConnectionStatus;
  user: UserWithStats;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleInitiateConnection() {
    if (user === null) return;
    initiateConnection(user.username, setIsLoading);
  }

  function hanleAcceptConnection() {
    if (user === null || connectionID === undefined) return;
    acceptConnection(user.username, connectionID, setIsLoading);
  }

  if (connectionStatus === ConnectionStatus.PENDING) {
    return (
      <button
        disabled={isLoading}
        className={buttonsStyles.primaryButton}
        onClick={() => hanleAcceptConnection()}
      >
        {isLoading ? <ButtonSyncLoader /> : "Accept"}
      </button>
    );
  } else if (connectionStatus === ConnectionStatus.SENT) {
    return (
      <button disabled className={buttonsStyles.primaryButton}>
        Pending...
      </button>
    );
  } else if (connectionStatus === ConnectionStatus.CONNECTED) {
    return <button className={buttonsStyles.primaryButton}>Message</button>;
  } else {
    return (
      <button
        disabled={isLoading}
        className={buttonsStyles.primaryButton}
        onClick={() => handleInitiateConnection()}
      >
        {isLoading ? <ButtonSyncLoader /> : "Connect"}
      </button>
    );
  }
}
