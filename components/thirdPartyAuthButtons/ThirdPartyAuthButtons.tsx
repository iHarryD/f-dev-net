import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import buttonsStyles from "../../styles/Buttons.module.css";

export default function ThirdPartyAuthButtons() {
  function handleSignIn(provider: BuiltInProviderType) {
    signIn(provider, { callbackUrl: "/" });
  }
  return (
    <>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${buttonsStyles.primaryButton}`}
        onClick={() => handleSignIn("twitter")}
      >
        <FontAwesomeIcon icon={faTwitter} />
        <span>Continue with Twitter</span>
      </button>
      <button
        className={`${buttonsStyles.iconWithTextButton} ${buttonsStyles.primaryButton}`}
        onClick={() => handleSignIn("github")}
      >
        <FontAwesomeIcon icon={faGithub} />
        <span>Continue with Github</span>
      </button>
    </>
  );
}
