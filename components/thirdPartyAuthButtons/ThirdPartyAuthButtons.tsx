import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import buttonsStyles from "../../styles/Buttons.module.css";

export default function ThirdPartyAuthButtons() {
  return (
    <>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${buttonsStyles.primaryButton}}`}
      >
        <FontAwesomeIcon icon={faTwitter} />
        <span>Continue with Twitter</span>
      </button>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${buttonsStyles.primaryButton}`}
      >
        <FontAwesomeIcon icon={faGithub} />
        <span>Continue with Github</span>
      </button>
    </>
  );
}
