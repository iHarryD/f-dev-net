import { useState } from "react";
import commonStyles from "../../styles/Common.module.css";
import ThirdPartyAuthButtons from "../thirdPartyAuthButtons/ThirdPartyAuthButtons";
import buttonsStyles from "../../styles/Buttons.module.css";
import signInFormStyles from "./SignInForm.module.css";

export default function SignInForm() {
  const [email, setEmail] = useState<string>("");

  return (
    <div className={commonStyles.authBoxContainer}>
      <form className={signInFormStyles.authBoxSection}>
        <div className={commonStyles.animatedInputLabelContainer}>
          <label
            htmlFor="email"
            className={`${commonStyles.animatedLabel} ${
              email ? commonStyles.labelIsAnimated : ""
            }`}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            value={email}
            className={commonStyles.authInput}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={buttonsStyles.primaryButton}
          onClick={(e) => e.preventDefault()}
        >
          Sign in
        </button>
      </form>
      <div className={signInFormStyles.sectionDivider}></div>
      <div className={signInFormStyles.authBoxSection}>
        <ThirdPartyAuthButtons />
      </div>
    </div>
  );
}
