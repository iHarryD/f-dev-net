import {
  ConnectionStatus,
  UserWithStats,
} from "../../interfaces/Common.interface";
import buttonsStyles from "../../styles/Buttons.module.css";

export default function ConnectionButton({
  connectionID,
  connectionStatus,
  user,
}: {
  connectionID?: string;
  connectionStatus: ConnectionStatus;
  user: UserWithStats;
}) {
  async function initiateConnection() {
    if (user === null) return;
    try {
      const data = {
        otherUser: user.username,
      };
      const result = await fetch("http://127.0.0.1:3000/api/connections", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.error(err);
    }
  }

  async function acceptConnection() {
    if (user === null || connectionID === undefined) return;
    try {
      const data = {
        otherUser: user.username,
      };
      const result = await fetch(
        `http://127.0.0.1:3000/api/connections/${connectionID}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resultJson = await result.json();
      console.log(resultJson);
    } catch (err) {
      console.error(err);
    }
  }

  if (connectionStatus === ConnectionStatus.PENDING) {
    return (
      <button
        className={buttonsStyles.primaryButton}
        onClick={() => acceptConnection()}
      >
        Accept
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
        className={buttonsStyles.primaryButton}
        onClick={() => initiateConnection()}
      >
        Connect
      </button>
    );
  }
}
