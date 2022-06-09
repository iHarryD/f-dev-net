import { faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import buttonsStyles from "../../styles/Buttons.module.css";
import thirdPartAuthButtonsStyles from "./ThirdPartyAuthButtons.module.css";

export default function ThirdPartyAuthButtons() {
  return (
    <>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${thirdPartAuthButtonsStyles.withGoogleButton}`}
      >
        <FontAwesomeIcon icon={faGoogle} />
        <span>Continue with Google</span>
      </button>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${thirdPartAuthButtonsStyles.withTwitterButton}`}
      >
        <FontAwesomeIcon icon={faTwitter} />
        <span>Continue with Twitter</span>
      </button>
    </>
  );
}
